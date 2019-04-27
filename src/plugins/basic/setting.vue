<template>
  <div class="airy-canvas-common-plugin-setting">
    <slider />
  </div>
</template>

<script>
import Slider from '@/components/common/Slider'

export default {
  name: 'BrushIcon',
  components: {
    Slider
  },
  props: {},
  data () {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
.airy-canvas-common-plugin-setting
  width 300px
  height 40px
  display flex
  justify-content center
  align-items center
</style>
