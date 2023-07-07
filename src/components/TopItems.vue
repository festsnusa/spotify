<template lang="pug">
.result 
  .header
    h1 Result 
  .content
    .firstStep(v-show="step === 1")
      p Set period and number of tracks
      .firstStep__content
        label(for="period") Period:
        a-select(name="period" ref="select" v-model:value="timeRange" style="width: 120px")
          a-select-option(value="short_term") 30 Days
          a-select-option(value="medium_term") 6 Months
          a-select-option(value="long_term") Several Years
        label(for="slider") Set # of tracks: 
        a-slider.slider(name="slider" v-model:value="limit" :min="1" :max="50")
        button(@click="nextStep") Next step
    .secondStep(v-show="step === 2")
      h2 Step 1:
      p Get your top {{ limit }} tracks from the last {{ calculatePeriod }}
      .list
        .item(v-for="(item, index) in tracksArr")
          span.number {{ index+1 }}
          .item__right
            span.title {{ item.title }}
            span.artist {{ item.artist }}
      button(v-show="!isActive" @click="getTopTracks") Run code
      button(v-show="isActive" @click="nextStep") Next step
    .thirdStep(v-show="step === 3")
      h2 Step 2:
      p Song recs based on {{ limit }} tracks from the last {{ calculatePeriod }}
      .list
        .item(v-for="(item, index) in recsArr")
          span.number {{ index+1 }}
          .item__right
            span.title {{ item.title }}
            span.artist {{ item.artist }}
      button(@click="nextStep") Next step
    .fourthStep(v-show="step === 4")
      h3 Step 3:
      p Create playlist based on {{ limit }} tracks from the last {{ calculatePeriod }}
      button(@click="playlist") Run code
    .fifthStep(v-show="step === 5")
      h4 Here's your playlist:
      iframe(style="border-radius:12px" :src="toEmbedLink" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy")
</template>

<script>
// import { createPlaylist } from '../includes/helpers'

import { mapStores } from 'pinia'
import { useClientStore } from '@/stores/clientInfo'

export default {
  name: "TopItems",
  data() {
    return {
      timeRange: 'short_term',
      limit: 5,
      tracksArr: [],
      recsArr: [],
      recsIDs: [],
      step: 1,
      isActive: false,
      playlistHref: '',
    }
  },
  computed: {
    ...mapStores(useClientStore),
    toEmbedLink() {
      return this.playlistHref.replace("/playlist/", "/embed/playlist/")
    },
    calculatePeriod() {
      return this.timeRange === 'short_term' ? '30 days' :
        this.timeRange === 'medium_term' ? '6 months'
          : 'several years'
    }
  },
  methods: {
    nextStep() {
      this.step += 1
    },
    playlist() {
      let arr = this.recsIDs.map(e => `spotify:track:${e}`)
      this.clientStore.createPlaylist(arr)
      this.nextStep()
    },
    async getTopTracks() {

      const accessToken = sessionStorage.getItem('access_token')

      await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${this.timeRange}&limit=${this.limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        }
      })
        .then(response => response.json())
        .then(data => {
          // console.log('Top items:', data)
          this.tracksArr = []

          this.recsIDs = []

          data.items.forEach((e) => {
            let obj = {}
            // obj.position = i + 1
            obj.title = e.name
            obj.artist = e.artists[0].name
            obj.id = e.id
            this.tracksArr.push(obj)
            this.recsIDs.push(e.id)
          })

          // console.log(this.tracksArr)
          this.getRecs(this.recsIDs)
          this.isActive = true

        })
        .catch(error => {
          console.error('Error creating playlist:', error);
          // Handle the error
          return
        });


    },
    async getRecs(recsIDs) {

      const accessToken = sessionStorage.getItem('access_token')

      this.recsArr = []

      for (let i = 0; i < 5; i++) {

        await fetch(`https://api.spotify.com/v1/recommendations?limit=${this.limit}&seed_tracks=${recsIDs[i]}`, {
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

            // console.log(this.recsArr)

          })
          .catch(error => {
            console.error('Error creating playlist:', error);
            // Handle the error
            return
          });

      }

      // console.log(this.recsArr)


    }
  },
  created() {
    this.clientStore.$subscribe((mutation, state) => {
      this.playlistHref = state.playlistHref
    })
  }
}
</script>

<style lang="scss" scoped>
.topItems {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider {
  width: 10%;
}

.header {
  height: 56px;
  border-bottom: 0.5px solid rgb(189, 189, 189);
  padding: 12px 0px 12px 32px;
  background-color: #3C0068;

  h1 {
    color: #fff;
  }

}

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

.item {

  display: flex;
  align-items: center;
  gap: 1rem;

  &__right {
    display: flex;
    flex-direction: column;
  }
}

.firstStep {
  &__content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}
</style>