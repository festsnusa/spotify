<template lang="pug">
.description
  .header
    p This project is designed to test Spotify API facilities.
  .content
    h2 How it works:
    ul
      li Click on "Authorize" button, which will redirect you to Spotify login page and generate an API access key. This access key is available within 1 hour. After 1 hour is expired, you need to press "Authorize" again to generate a new API access key;
      li If User ID's field is empty, click on "Get";
      li Set period (30 days, 6 months, several years) and number of top tracks. Click on "Next step";
      li Get top tracks by clicking "Run code". After clicking button, the list with top tracks will appear. Click on "Next step" to proceed;
      li On the next step you'll see the list of recommended tracks based on the list of the top tracks. For each track it generate 5 recommended tracks. So, for example, if you choose 5 top tracks, the result will contain 25 tracks. Click on "Next step";
      li Create playlist by clicking "Run code";
      li Check your Spotify profile, you will get a new playlist titled "My Recs Playlist".

</template>

<script>
export default {
  name: "DescriptionApp",
}
</script>

<style lang="scss" scoped>
.description {
  line-height: 2rem;
}
</style>