<template>
  <div class="airy-slider-container">
    <div class="airy-slider-bar" />
    <div
      class="airy-slider-warpper"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousedown="onButtonDown"
      @touchstart="onButtonDown"
      :class="{ 'hover': hovering, 'dragging': dragging }"
      :style="wrapperStyle"
      ref="button"
      tabindex="0"
      @focus="handleMouseEnter"
      @blur="handleMouseLeave"
      @keydown.left="onLeftKeyDown"
      @keydown.right="onRightKeyDown"
      @keydown.down.prevent="onLeftKeyDown"
      @keydown.up.prevent="onRightKeyDown"
    >
      <div class="airy-slider-bullet" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Slider',
  props: {
    value: {
      type: Number,
      default: 32
    }
  },
  data () {
    return {
      hovering: false,
      dragging: false,
      isClick: false,
      startX: 0,
      currentX: 0,
      startY: 0,
      currentY: 0,
      startPosition: 0,
      newPosition: null,
      oldValue: this.value,
      sliderSize: 100,
      sliderDisabled: false,
      max: 100,
      min: 0,
      step: 1,
      showTooltip: false,
      precision: 1,
      input: this.value
    }
  },
  computed: {
    disabled () {
      return this.sliderDisabled
    },
    currentPosition () {
      return `${(this.input - this.min) / (this.max - this.min) * 100}%`
    },
    enableFormat () {
      return this.formatTooltip instanceof Function
    },
    formatValue () {
      return this.enableFormat && (this.formatTooltip(this.value) || this.value)
    },
    wrapperStyle () {
      return this.vertical ? { bottom: this.currentPosition } : { left: this.currentPosition }
    },
    barStyle () {
      return this.vertical ? {
        height: this.barSize,
        bottom: this.barStart
      } : {
        width: this.barSize,
        left: this.barStart
      }
    }
  },
  methods: {
    displayTooltip () {},
    hideTooltip () {},
    handleMouseEnter () {
      this.hovering = true
      this.displayTooltip()
    },
    handleMouseLeave () {
      this.hovering = false
      this.hideTooltip()
    },
    onButtonDown (event) {
      if (this.disabled) return
      event.preventDefault()
      this.onDragStart(event)
      window.addEventListener('mousemove', this.onDragging)
      window.addEventListener('touchmove', this.onDragging)
      window.addEventListener('mouseup', this.onDragEnd)
      window.addEventListener('touchend', this.onDragEnd)
      window.addEventListener('contextmenu', this.onDragEnd)
    },
    onLeftKeyDown () {
      if (this.disabled) return
      this.newPosition = parseFloat(this.currentPosition) - this.step / (this.max - this.min) * 100
      this.setPosition(this.newPosition)
      this.emitChange()
    },
    onRightKeyDown () {
      if (this.disabled) return
      this.newPosition = parseFloat(this.currentPosition) + this.step / (this.max - this.min) * 100
      this.setPosition(this.newPosition)
      this.emitChange()
    },
    onDragStart (event) {
      this.dragging = true
      this.isClick = true
      if (event.type === 'touchstart') {
        event.clientY = event.touches[0].clientY
        event.clientX = event.touches[0].clientX
      }
      if (this.vertical) {
        this.startY = event.clientY
      } else {
        this.startX = event.clientX
      }
      this.startPosition = parseFloat(this.currentPosition)
      this.newPosition = this.startPosition
    },
    onDragging (event) {
      if (this.dragging) {
        this.isClick = false
        this.displayTooltip()
        // this.resetSize()
        let diff = 0
        if (event.type === 'touchmove') {
          event.clientY = event.touches[0].clientY
          event.clientX = event.touches[0].clientX
        }
        if (this.vertical) {
          this.currentY = event.clientY
          diff = (this.startY - this.currentY) / this.sliderSize * 100
        } else {
          this.currentX = event.clientX
          diff = (this.currentX - this.startX) / this.sliderSize * 100
        }
        this.newPosition = this.startPosition + diff
        this.setPosition(this.newPosition)
      }
    },
    onDragEnd () {
      if (this.dragging) {
        /*
          * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
          * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
          */
        setTimeout(() => {
          this.dragging = false
          this.hideTooltip()
          if (!this.isClick) {
            this.setPosition(this.newPosition)
            this.emitChange()
          }
        }, 0)
        window.removeEventListener('mousemove', this.onDragging)
        window.removeEventListener('touchmove', this.onDragging)
        window.removeEventListener('mouseup', this.onDragEnd)
        window.removeEventListener('touchend', this.onDragEnd)
        window.removeEventListener('contextmenu', this.onDragEnd)
      }
    },
    setPosition (newPosition) {
      if (newPosition === null || isNaN(newPosition)) return
      if (newPosition < 0) {
        newPosition = 0
      } else if (newPosition > 100) {
        newPosition = 100
      }
      const lengthPerStep = 100 / ((this.max - this.min) / this.step)
      const steps = Math.round(newPosition / lengthPerStep)
      let value = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min
      value = parseFloat(value.toFixed(this.precision))
      this.input = value
      this.$nextTick(() => {
        this.$refs.tooltip && this.$refs.tooltip.updatePopper()
      })
      if (!this.dragging && this.value !== this.oldValue) {
        this.oldValue = this.value
      }
    },
    emitChange () {
      this.$emit('update:value', this.newPosition)
    }
  }
}
</script>

<style lang="stylus" scoped>
.airy-slider-container
  width 100%
  height 6px
  margin 16px 0
  background-color #e4e7ed
  border-radius 3px
  position relative
  cursor pointer
  vertical-align middle
  .airy-slider-warpper
    height 36px
    width 36px
    position absolute
    z-index 1001
    top -15px
    transform translateX(-50%)
    background-color transparent
    display inline-flex
    align-items center
    justify-content center
    .airy-slider-bullet
      width 16px
      height 16px
      border 2px solid #409eff
      background-color #fff
      border-radius 50%
      transition .2s
      user-select none
</style>
