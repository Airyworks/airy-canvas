<template>
  <transition name="airy-hide">
    <div id="airy-palettebar" v-if="config.length">
      <div class="item" v-for="(item, index) in config" :key="index">
        <Palette :config="item"/>
      </div>
    </div>
  </transition>
</template>

<script>
import Palette from './palettes'

export default {
  name: 'PaletteBar',
  data () {
    return {
      config: []
    }
  },
  created () {
    this.$airyCtx.on('changetool', this.updateConfig)
  },
  methods: {
    updateConfig (tool) {
      this.config = tool.paletteConfig || []
    }
  },
  components: {
    Palette
  }
}
</script>

<style lang="stylus">
#airy-palettebar
  box-sizing border-box
  position absolute
  z-index 9
  width calc(100% - 4px)
  height 42px
  left 2px
  bottom 46px
  border-radius 4px
  padding 4px
  background-color #494949
  color #fff
  display flex
  align-items center
  font-size 12px
  .item
    height 30px
    font-size 12px
    line-height 20px
    margin 2px
    padding 4px 8px
    border-radius 4px
    box-sizing border-box
    display flex
    justify-content center
    align-items center
    user-select none
    border solid 1px #494949

.airy-hide-enter, .airy-hide-leave-to
  transform translateY(20px)
  opacity 0
.airy-hide-enter-active, .airy-hide-leave-active
  transition all .5s
</style>
