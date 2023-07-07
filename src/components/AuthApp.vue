<template lang="pug">
.auth
  a-button(type="primary" @click="login") Authorize
</template>

<script>
import { mapStores } from 'pinia'
import { useClientStore } from '@/stores/clientInfo'

import { useRouter } from 'vue-router';
import { authorizeUser, handleCallback } from '../includes/spotifyService';
// import { authorizeUser, handleCallback, spotifyApi } from './spotifyService';

export default {
  name: "AuthApp",
  computed: {
    ...mapStores(useClientStore),
  },
  methods: {
    authorize() {
      const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${this.clientStore.clientID}&response_type=code&redirect_uri=${encodeURIComponent(this.clientStore.redirectUri)}&scope=${encodeURIComponent(this.clientStore.scope)}`

      const router = useRouter();
      router.push(authorizationUrl);
    },
    login() {

      // const authorizeURL = getAuthorizeURL();
      // window.location.href = authorizeURL;

      authorizeUser();
    }
  },
  mounted() {
    handleCallback()
  }
}
</script>

<style lang="scss" scoped></style>