<template lang="pug">
.playlist-name
  label(for="playlist-name") Playlist title:
  a-input(name="playlist-name" v-model:value="playlistName" placeholder="Set your playlist title")
  label(for="playlist-description") Playlist description:
  a-input(name="playlist-description" v-model:value="playlistDescription" placeholder="Set your playlist description")
  a-checkbox.checkbox(v-model:checked="public") Set as public
textarea(v-model="message" placeholder="add multiple lines")
a-button(type="primary" @click="getTracks") Get
textarea(v-model="IDs" placeholder="track IDs..." :v-if="IDs.length")
a-button(type="primary" @click="createPlaylist") Create playlist
</template>

<script>
import { mapStores } from 'pinia'
import { useClientStore } from '@/stores/clientInfo'

export default {
  name: "TextField",
  data() {
    return {
      message: '',
      arr: [],
      IDs: [],
      playlistName: 'New Playlist',
      playlistDescription: '',
      public: false,
    }
  },
  computed: {
    ...mapStores(useClientStore),
    viewIDs() {

      let text = ''
      this.IDs.forEach(e => {
        text += e + '\n'
      })
      return text
    }

  },
  methods: {
    async searchTracks(artist, title) {

      this.IDS = []

      const query = `track:${title}%20artist:${artist}`
      const url = `https://api.spotify.com/v1/search?q=${query}&type=track`

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
          }
        })

        if (!response.ok) {
          // alert(`Request failed with status ${response.status}`)
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json()
        // console.log(data)

        let items = data.tracks.items

        if (items.length > 0) {
          this.IDs.push(`spotify:track:${items[0].id}`)
        }

        console.log(this.IDs)

      } catch (error) {
        console.error('Error:', error)
      }

    },
    getTracks() {

      const lines = this.message.replace(/—/g, '-').split('\n');

      // Process each line
      lines.forEach(line => {
        let arr = line.split('-')

        if (arr.length < 2) {
          return
        }

        let artist = arr[0].trim()
        let title = arr[1].trim()
        this.arr.push({ "artist": artist, "title": title })
      })

      this.arr.forEach(e => {
        this.searchTracks(e.artist, e.title)
      })

    },
    createPlaylist() {

      const accessToken = sessionStorage.getItem('access_token'); // Replace with your Spotify access token

      // Define the request body
      const data = {
        name: this.playlistName,
        public: this.public,
        description: this.playlistDescription,
        collaborative: false,
      };

      fetch('https://api.spotify.com/v1/me/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Playlist created:', data);
          this.clientStore.playlistID = data.id
          // Perform any additional operations after playlist creation
          this.addItems()
        })
        .catch(error => {
          console.error('Error creating playlist:', error);
          // Handle the error
          return
        });
    },
    addItems() {

      const accessToken = sessionStorage.getItem('access_token'); // Replace with your Spotify access token

      fetch(`https://api.spotify.com/v1/playlists/${this.clientStore.playlistID}/tracks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ uris: this.IDs }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Tracks added to playlist:', data);
          // Perform any additional operations after adding tracks
        })
        .catch(error => {
          console.error('Error adding tracks to playlist:', error);
          // Handle the error
        });
    },
  }
}
</script>

<style lang="scss" scoped>
textarea {
  background-color: #fff;
  color: #000;
  width: 30rem;
  min-height: 10rem;
}

.checkbox {
  color: #fff;
}
</style>