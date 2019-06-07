<template>
  <div id="app">
    <airy-canvas
      :data="airyCanvasData"
      :options="airyCanvasOptions"
      @commit="commit"
    />
  </div>
</template>

<script>
import AiryCanvas from '@/AiryCanvas'
import mockData from './mock-data'

export default {
  name: 'example',
  components: {
    AiryCanvas
  },
  data () {
    return {
      airyCanvasData: mockData,
      airyCanvasOptions: {
        fluid: true
      }
    }
  },
  methods: {
    commit (element) {
      console.log('commit event', element)
    }
  }
}
</script>

<style lang="stylus">
body
  background-color #242424
  margin 0
  height 100vh
  display flex
  justify-content center
  align-items center
  #app
    height 100%
    width 100%
</style>
