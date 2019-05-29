<template>
  <div class="airy-canvas-container" :style="{
    width: boxSize.width,
    height: boxSize.height
  }">
    <!-- PIXI container -->
    <div class="airy-box" ref="airy-box" />
    <tool-bar
      :tools="plugins"
      :active="active ? active.name : ''"
      @active="activePlugin"
      @updateConfig="updateConfig"
    />
  </div>
</template>

<script>
import 'roboto-fontface'
import './assets/common.styl'
import ToolBar from './components/ToolBar'
import CanvasMixin from './mixins/CanvasMixin'

export default {
  name: 'AiryCanvas',
  mixins: [CanvasMixin],
  components: {
    ToolBar
  }
}
</script>

<style lang="stylus" scoped>
.airy-canvas-container
  position relative
  .airy-box
    position absolute
    height 100%
    width 100%
</style>
