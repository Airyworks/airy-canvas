<template>
  <div
    class="airy-canvas-common-plugin-setting"
    :style="{
      height: height + 'px',
      top: -(height - 40) / 2 + 'px'
    }"
  >
    <p class="airy-canvas-setting-title">Font Size</p>
    <slider
      class="airy-canvas-plugin-slider"
      :value.sync="fontsize"
    />
  </div>
</template>

<script>
import Slider from '@/components/common/Slider'
import cfg from './airy.plugin'

export default {
  name: 'LineSetting',
  components: {
    Slider
  },
  props: {},
  data () {
    return {
      cfg,
      height: 200,
      fontsize: 14
    }
  },
  watch: {
    fontsize (val) {
      this.$emit('update', {
        fontsize: val
      })
    }
  },
  methods: {
    updateConfig (v) {
      console.log('upvalue', v)
    }
  }
}
</script>

<style lang="stylus" scoped>
.airy-canvas-common-plugin-setting
  width 150px
  padding 15px
</style>
