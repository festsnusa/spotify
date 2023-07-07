<template lang="pug">
h1 Authorization process has been passed
RouterLink(to="/")
  span go back
</template>

<script>
import { handleCallback } from '../includes/spotifyService';
export default {
  name: "CallbackPage",
  mounted() {
    handleCallback()
  }
}
</script>

<style lang="scss" scoped></style>