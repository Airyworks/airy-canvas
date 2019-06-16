<template>
  <div id="app">
    <airy-canvas
      ref="canvas"
      :data="airyCanvasData"
      :options="airyCanvasOptions"
      @commit="commit"
    />
    <div class="option-btn-group">
      <button class="clear-btn" @click="clear">clear</button>
      <button class="history-btn" @click="getHistory">getHistory</button>
    </div>
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
    },
    clear () {
      this.$refs['canvas'].clear()
    },
    getHistory () {
      console.log(this.$refs['canvas'].getHistory())
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
  .option-btn-group
    position fixed
    top: 20px
    right: 30px
</style>
