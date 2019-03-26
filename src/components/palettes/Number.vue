<template>
  <div class="airy-palette-number">
    <span>{{ name }}</span>
    <input type="range" :min="min" :max="max" :step="step" v-model="value" @change="onChange">
    <span class="number">{{ Number(value).toFixed(2) }}</span>
  </div>
</template>

<script>
import { formatName } from '@/utils'

export default {
  name: 'PaletteNumber',
  props: {
    config: Object
  },
  data () {
    return {
      value: this.$airyCtx.activeTool[this.config.attribute]
    }
  },
  computed: {
    name () {
      return formatName(this.config.name)
    },
    min () {
      if (this.config.option) {
        return this.config.option.min || 0
      }
      return 0
    },
    max () {
      if (this.config.option) {
        return this.config.option.max || 1
      }
      return 1
    },
    step () {
      if (this.config.option) {
        return this.config.option.step || 'any'
      }
      return 'any'
    }
  },
  methods: {
    onChange () {
      this.$airyCtx.activeTool.set(this.config.name, Number(this.value))
    }
  }
}
</script>

<style lang="stylus" scoped>
.airy-palette-number
  display flex
  input
    margin 0 6px
    height 20px
  .number
    width 30px
</style>
