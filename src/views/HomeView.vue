<template lang="pug">
HeaderApp
main
  DescriptionApp
  AuthApp
  UserID
  //- section
  //-   TextField

  section
    TabsApp
    //- TopItems

</template>

<script>
import HeaderApp from '@/components/HeaderApp.vue'
import AuthApp from '@/components/AuthApp.vue'

import DescriptionApp from '@/components/DescriptionApp.vue'

import UserID from '@/components/UserID.vue'
import TextField from '@/components/TextField.vue'

import TabsApp from '@/components/TabsApp.vue'

export default {
  name: "HomeView",
  components: {
    HeaderApp,
    AuthApp,
    DescriptionApp,
    UserID,
    TextField,
    TabsApp,
  },
}
</script>

<style lang="scss" scoped>
main {
  padding: 2rem 5rem;
}
</style>