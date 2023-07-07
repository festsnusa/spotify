<template lang="pug">
header
  img(src="@/assets/images/icon-spotify.png", alt="logo")
  span Spotify
</template>

<script>
export default {
  name: "HeaderApp",
}
</script>

<style lang="scss" scoped>
header {

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 2rem;

  img {
    width: 3rem;
  }

  span {
    text-transform: uppercase;
    font-size: 2rem;
    letter-spacing: 1rem;
  }
}
</style>