<template>
  <div
    class="airy-canvas-common-plugin"
    :style="{
      color: active ? '#1079bb' : '#333'
    }"
    @click="$emit('focus', cfg.name)"
  >
    <font-awesome-icon
      :icon="icon"
      size="1x"
    />
  </div>
</template>

<script>
import cfg from './airy.plugin'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMousePointer } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'BrushIcon',
  components: {
    FontAwesomeIcon
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      cfg
    }
  },
  computed: {
    icon () {
      return faMousePointer
    }
  },
  methods: {
    clk () {
      console.log('clk')
    }
  }
}
</script>

<style lang="stylus" scoped>
.airy-canvas-common-plugin
  width 100%
  height 40px
  display flex
  justify-content center
  align-items center
</style>
