import { ref } from 'vue';
import { defineStore } from 'pinia';
// import SpotifyWebApi from 'spotify-web-api-node'

export const useClientStore = defineStore(
  'client',
  () => {
    const apiKey = ref(
      'BQDAj5QYPei30IlzwRK06M0likkwR3UxY0MDsxAf8GMuSyvXgh_QWaN8x5QktLux9H8iBpcww9gytOQqkCtqu8evbI5u6SR6TI0dBeeNUxvoQTL-3mjOkr9q3ifenDk8RQqDd2eHZU9dFBIn3wGncF4QQ4BqA9QrnPlrcknTfABzT-PxLh5GeQEVauEwtGN3Aof2MeNXbTu0EhzRfVaa0vYhMLu63lxx-g0TpXZiFNcgTwKOeZmrHJCceNzuI2Cknm_FecCoLUo-c0rkXQ6s-GUv'
    );
    const clientID = ref('99e18dceec0e44a1b6fb9fd0b9596685');
    const clientSecret = ref('66d89b64ceae4fe0a091b772b2224a28');
    const userID = ref('3137xkjhtkq75iunmnrv2jqednre');
    // const redirectUri = ref('http://localhost:8888/callback')
    const scopes = ref([
      'ugc-image-upload',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'streaming',
      'app-remote-control',
      'user-read-email',
      'user-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-read-private',
      'playlist-modify-private',
      'user-library-modify',
      'user-library-read',
      'user-top-read',
      'user-read-playback-position',
      'user-read-recently-played',
      'user-follow-read',
      'user-follow-modify',
    ]);

    // const spotifyApi = new SpotifyWebApi({
    //   clientId: '99e18dceec0e44a1b6fb9fd0b9596685',
    //   clientSecret: '66d89b64ceae4fe0a091b772b2224a28',
    //   redirectUri: 'http://localhost:8888/callback'
    // })

    const playlistID = '';
    let playlistHref = ref('');

    const createPlaylist = (trackIDs) => {
      const accessToken = sessionStorage.getItem('access_token'); // Replace with your Spotify access token

      // Define the request body
      const data = {
        name: 'My Recs Playlist',
        public: false,
        description: '',
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
        .then((response) => response.json())
        .then((data) => {
          console.log('Playlist created:', data);
          // sessionStorage.setItem('playlist_href', data.external_urls.spotify)
          playlistHref.value = data.external_urls.spotify;

          if (trackIDs.length > 100) {
            let separated = separateArray(trackIDs, 100);
            separated.forEach((IDs) => {
              addItems(data.id, IDs);
            });
          } else {
            addItems(data.id, trackIDs);
          }
        })
        .catch((error) => {
          console.error('Error creating playlist:', error);
          // Handle the error
          return;
        });
    };

    const addItems = (playlistID, trackIDs) => {
      const accessToken = sessionStorage.getItem('access_token'); // Replace with your Spotify access token

      fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ uris: trackIDs }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error !== undefined) {
            alert(`Error: ${data.error.message}`);
            throw Error(data.error.message);
          }
          console.log('Tracks added to playlist:', data);
          // Perform any additional operations after adding tracks
        })
        .catch((error) => {
          console.error('Error adding tracks to playlist:', error);
          // Handle the error
        });
    };

    const separateArray = (array, maxSize) => {
      var separatedArrays = [];
      var subArray = [];

      for (var i = 0; i < array.length; i++) {
        subArray.push(array[i]);

        if (subArray.length === maxSize || i === array.length - 1) {
          separatedArrays.push(subArray);
          subArray = [];
        }
      }

      return separatedArrays;
    };

    return {
      apiKey,
      clientID,
      clientSecret,
      userID,
      scopes,
      playlistID,
      playlistHref,
      createPlaylist,
    };
  },
  { persist: { storage: sessionStorage } }
);
