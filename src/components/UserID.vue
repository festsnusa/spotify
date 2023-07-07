<template lang="pug">
.userID
  label(for="user") User ID:
  a-input(name="user" v-model:value="userID" placeholder="Your user ID" disabled)
  a-button(type="primary" @click="getuserID") Get
</template>

<script>
import { mapStores } from 'pinia'
import { useClientStore } from '@/stores/clientInfo'

export default {
  name: "UserID",
  data() {
    return {
      userID: sessionStorage.getItem('user_ID'),
    }
  },
  computed: {
    ...mapStores(useClientStore),
  },
  methods: {
    async getuserID() {
      const tokenEndpoint = 'https://api.spotify.com/v1/me';

      try {
        const response = await fetch(tokenEndpoint, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
          }
        });

        if (!response.ok) {
          alert(`Request failed with status ${response.status}`)
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json()
        this.userID = data.id
        // this.clientStore.userID = data.id
        sessionStorage.setItem('user_ID', data.id)
      } catch (error) {
        console.error('Error:', error)
      }
    }
  },
  // created() {
  //   this.userID = this.clientStore.userID
  //   this.apiKey = this.clientStore.apiKey

  //   this.clientStore.$subscribe((mutation, state) => {
  //     this.userID = state.userID
  //     this.apiKey = state.apiKey
  //   })
  // }
}
</script>

<style lang="scss" scoped>
.userID {
  display: flex;
  align-items: center;
  gap: 1rem;

  input {
    width: 16rem;
  }
}
</style>