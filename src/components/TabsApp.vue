<template lang="pug">
a-tabs(v-model:activeKey="activeKey")
  a-tab-pane(key="1" tab="Top Tracks")
    TopItems
  a-tab-pane(key="2" tab="Recs based on artist" force-render)
    RecommendSecond
</template>

<script>
import TopItems from '@/components/TopItems.vue'
import RecommendSecond from '@/components/RecommendSecond.vue'

export default {
  name: "TabsApp",
  components: {
    TopItems,
    RecommendSecond,
  },
}
</script>

<style lang="scss" scoped>
.ant-tabs {
  color: #fff;
}
</style>