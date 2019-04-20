<template>
  <!-- PIXI container -->
  <div ref="airy-box" :style="{
    width: boxSize.width,
    height: boxSize.height
  }" />
</template>

<script>
import CanvasMixin from '@/mixins/CanvasMixin'

export default {
  name: 'airyCanvas',
  mixins: [CanvasMixin]
}
</script>

<style lang="stylus">
#airy-box
  position relative
#airy-canvas
  border-radius 4px
  background-color #fff
</style>
