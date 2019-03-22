<template>
  <div id="airy-box" :style="{ width: width + 'px', height: height + 'px' }">
    <canvas id="airy-canvas" :width="width" :height="height"></canvas>
    <ToolsBar ref="toolsBar"/>
  </div>
</template>

<script>
import ToolsBar from '@/components/ToolsBar'

import Recorder from '@/model/Recorder'
import Pen from '@/model/brush/Pen'

export default {
  name: 'airyCanvas',
  props: {
    width: {
      type: Number,
      default: 1000
    },
    height: {
      type: Number,
      default: 800
    }
  },
  data () {
    return {
      canvas: null,
      ctx: null,
      recorder: null,
      needSolidify: false
    }
  },
  watch: {
    width () {
      this.onrisize()
    },
    height () {
      this.onrisize()
    }
  },
  mounted () {
    const canvas = this.$el.querySelector('#airy-canvas')
    const ctx = canvas.getContext('2d')
    const recorder = new Recorder(canvas)
    const defaultTool = new Pen(recorder)

    this.$airyCtx.activeTool = defaultTool
    this.$airyCtx.recorder = recorder

    this.canvas = canvas
    this.ctx = ctx
    this.recorder = recorder
    this.bindEvent()
    this.setDefaultPen()
    this.$refs.toolsBar.bind(this.$airyCtx)
    requestAnimationFrame(() => {
      this.render()
    })
  },
  methods: {
    bindEvent () {
      const canvas = this.canvas
      canvas.addEventListener('contextmenu', e => {
        e.preventDefault()
      })
      canvas.addEventListener('mousedown', e => {
        if (e.button !== 0) {
          return
        }
        const x = e.offsetX
        const y = e.offsetY
        this.$airyCtx.activeTool.beginAtPos(x, y)
      })
      canvas.addEventListener('mousemove', e => {
        const x = e.offsetX
        const y = e.offsetY
        this.$airyCtx.activeTool.moveAtPos(x, y)
      })
      const userInputInterrupt = e => {
        const x = e.offsetX
        const y = e.offsetY
        const end = this.$airyCtx.activeTool.endAtPos(x, y)
        if (end) {
          this.needSolidify = true
        }
      }
      canvas.addEventListener('mouseup', userInputInterrupt)
      canvas.addEventListener('mouseleave', userInputInterrupt)

      canvas.addEventListener('mousedown', this.setActivePen)
      canvas.addEventListener('mouseup', this.setDefaultPen)
      canvas.addEventListener('mouseleave', this.setDefaultPen)
    },
    setActivePen (e) {
      if (e.button) {
        return
      }
      this.canvas.style.cursor = this.$airyCtx.getCursor(true)
    },
    setDefaultPen () {
      this.canvas.style.cursor = this.$airyCtx.getCursor()
    },
    render (time) {
      const ctx = this.ctx
      if (this.$airyCtx.activeTool.needUpdate) {
        // const activeCtx = this.recorder.getActiveLayer()
        this.$airyCtx.activeTool.updateWithActiveLayer(this.recorder.activeLayer)
        this.recorder.needUpdate = true
      }
      if (this.needSolidify) {
        this.recorder.solidify()
        this.needSolidify = false
      }
      if (this.recorder.needUpdate) {
        this.recorder.render(ctx)
        this.recorder.needUpdate = false
      }
      requestAnimationFrame(() => {
        this.render()
      })
    },
    onrisize () {
      // TODO
    }
  },
  components: {
    ToolsBar
  }
}
</script>

<style lang="stylus">
#airy-box
  position relative
#airy-canvas
  border-radius 4px
  background-color #fff
</style>
