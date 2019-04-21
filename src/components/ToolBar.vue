<template>
  <div class="airy-canvas-toolbar-box"
    ref="toolbar-box"
    :style="{
      width: '40px',
      left: '5px',
      top: top + 'px'
    }"
  >
    <template
      v-for="(tool, key) in tools"
    >
      <component
        :key="key"
        :is="tool.component"
        :active="tool.name === active"
        @focus="$emit('active', arguments[0])"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'ToolBar',
  props: {
    tools: {
      type: Array,
      default: () => {
        return []
      }
    },
    active: {
      type: String,
      default: 'basic-move'
    }
  },
  data () {
    return {
      top: 0
    }
  },
  mounted () {
    window.addEventListener('resize', this.resize)
    this.resize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize () {
      this.top = (window.innerHeight - this.$refs['toolbar-box'].offsetHeight) / 2
    }
  }
}
</script>

<style lang="stylus" scoped>
.airy-canvas-toolbar-box
  position absolute
  transition top 0.3s ease-in-out
  background #ffffff
  box-shadow 0 8px 16px 0 rgba(0, 0, 0, 0.12)
</style>
