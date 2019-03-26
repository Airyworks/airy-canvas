<template>
  <div class="airy-palette-color">
    <span>{{ name }}</span>
    <input type="range" min="0" max="360" step="1" v-model="colorH" @change="onChange">
    <span class="color" :style="{
      'background-color': `hsl(${colorH}, 100%, 50%)`
    }"></span>
  </div>
</template>

<script>
import { formatName } from '@/utils'

export default {
  name: 'PaletteColor',
  props: {
    config: Object
  },
  data () {
    return {
      colorH: '0',
      value: this.$airyCtx.activeTool[this.config.attribute]
    }
  },
  computed: {
    name () {
      return formatName(this.config.name)
    }
  },
  methods: {
    onChange () {
      this.$airyCtx.activeTool.set(this.config.name, `hsl(${this.colorH}, 100%, 50%)`)
    }
  }
}
</script>

<style lang="stylus" scoped>
.airy-palette-color
  display flex
  input
    margin 0 6px
    height 20px
  .color
    width 20px
    height 20px
    box-sizing border-box
    border solid 2px #fff
</style>
