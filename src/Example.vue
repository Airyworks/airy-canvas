<template>
  <div id="app">
    <airy-canvas
      :data="airyCanvasData"
      :options="airyCanvasOptions"
    />
  </div>
</template>

<script>
import AiryCanvas from '@/AiryCanvas'

export default {
  name: 'example',
  components: {
    AiryCanvas
  },
  data () {
    return {
      airyCanvasData: [],
      airyCanvasOptions: {
        fluid: true
      }
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
