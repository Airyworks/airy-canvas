<template>
  <div id="app" @click="addData">
    <airy-canvas
      :data="airyCanvasData"
      :options="airyCanvasOptions"
    />
  </div>
</template>

<script>
import AiryCanvas from '@/AiryCanvas'
import mockdata, { generate } from './mock-data'

export default {
  name: 'example',
  components: {
    AiryCanvas
  },
  data () {
    return {
      airyCanvasData: mockdata,
      airyCanvasOptions: {
        fluid: true
      }
    }
  },
  methods: {
    addData () {
      this.airyCanvasData.push(generate())
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
