<template lang="pug">
.content
  .firstStep(v-show="step === 1")
    button(@click="getGenres") get genres
    a-select(name="period" ref="select" v-model:value="genre" style="width: 120px")
      a-select-option(value="item" v-for="item in availableGenres" @click="addGenre(item)") {{ item }}
    .genres
      .genre(v-for="value in chosenGenres" @click="deleteGenre(value)") {{ value }}
    section
      label(for="artists") Filter by artists:
      a-input(name="artists" v-model:value="artists" placeholder="Paste artists IDs and separate by comma")
    button(@click="getRecs") Run code
  .secondStep(v-show="step === 2")
    p Create playlist
    button(@click="playlist") Run code
    .list
      .item(v-for="(item, index) in recsArr")
        span.number {{ index+1 }}
        .item__right
          span.title {{ item.title }}
          span.artist {{ item.artist }}
  .thirdStep(v-show="step === 3")
    p Playlist created! Check your Spotify profile.

</template>

<script>
import { mapStores } from 'pinia'
import { useClientStore } from '@/stores/clientInfo'

export default {
  name: "RecommendSecond",
  data() {
    return {
      step: 1,
      availableGenres: [],
      genre: '',
      chosenGenres: [],
      artists: '',
      recsIDs: [],
      recsArr: [],
    }
  },
  computed: {
    ...mapStores(useClientStore),
  },
  methods: {
    nextStep() {
      this.step += 1
      console.log(this.step)
    },
    playlist() {
      let arr = this.recsIDs.map(e => `spotify:track:${e}`)
      this.clientStore.createPlaylist(arr)
      this.nextStep()
    },
    async getGenres() {
      const accessToken = sessionStorage.getItem('access_token')

      await fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        }
      })
        .then(response => response.json())
        .then(data => {
          // console.log('Genres:', data)
          this.availableGenres = data.genres

        })
        .catch(error => {
          console.error('Error getting genres:', error);
          // Handle the error
          return
        });
    },
    addGenre(genre) {
      if (this.chosenGenres.includes(genre)) {
        return
      }

      this.chosenGenres.push(genre)

    },
    deleteGenre(genre) {
      let index = this.chosenGenres.indexOf(genre)
      if (index !== -1) {
        this.chosenGenres.splice(index, 1)
      }
    },
    async getRecs() {

      const accessToken = sessionStorage.getItem('access_token')

      const seedArtists = `${this.artists.length ? this.artists : ''}`
      const seedGenres = `${this.chosenGenres.length ? this.chosenGenres.join(',') : ''}`

      for (let i = 0; i < 5; i++) {

        await fetch(`https://api.spotify.com/v1/recommendations?seed_artists=${seedArtists}&seed_genres=${seedGenres}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          }
        })
          .then(response => response.json())
          .then(data => {

            // console.log('Rec items:', data)

            data.tracks.forEach((e) => {

              if (this.recsIDs.includes(e.id)) {
                return
              }
              let obj = {}
              // obj.position = i + 1
              obj.title = e.name
              obj.artist = e.artists[0].name
              obj.id = e.id
              this.recsIDs.push(e.id)
              this.recsArr.push(obj)
            })

          })
          .catch(error => {
            console.error('Error creating playlist:', error);
            // Handle the error
            return
          });

      }

      this.nextStep()

      // console.log(this.recsArr)


    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 16px 32px;
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  -webkit-box-pack: justify;
  justify-content: space-between;

  button {
    -webkit-tap-highlight-color: transparent;
    font-size: 1.125rem;
    font-weight: 700;
    background-color: #CDF56A;
    border: none;
    border-radius: 500px;
    align-self: center;
    padding: 1rem 1.5rem;
    color: #000;

    &:hover {
      transform: scale(1.1);
      transition: all 0.2s ease-in;
    }
  }
}

.genres {
  display: flex;
  align-items: baseline;
}

.genre {
  cursor: pointer;
  background-color: #FEE27B;
  padding: 1rem;
  border-radius: 20px;
  color: #000;
  max-width: 11rem;

}

.item {

  display: flex;
  align-items: center;
  gap: 1rem;

  &__right {
    display: flex;
    flex-direction: column;
  }
}
</style>