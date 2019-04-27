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
      <div :key="key" class="airy-canvas-toolbar-item">
        <component
          :is="tool.component"
          :active="tool.name === active"
          @focus="focus"
        />
        <transition name="fade-left">
          <component
            v-if="tool.settingPanel && tool.name === active && openSetting"
            :is="tool.settingPanel"
            class="airy-canvas-tool-setting"
            @update="updateCfg"
          />
        </transition>
      </div>
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
      top: 0,
      openSetting: false
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
    },
    focus (name) {
      this.openSetting = true
      this.$emit('active', name)
      console.log(this.tools.find(i => i.name === name))
    },
    updateCfg (cfg) {
      this.$emit('updateConfig', this.active, cfg)
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
  .airy-canvas-toolbar-item
    position relative
    .airy-canvas-tool-setting
      position absolute
      left 50px
.fade-left-enter-active, .fade-left-leave-active
  transition .5s ease-in-out
.fade-left-enter .fade-left-leave-to
  opacity 0
  transform translateX(-50%)
</style>
