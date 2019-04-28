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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import cfg from './airy.plugin'

export default {
  name: 'ImageIcon',
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
      return faImage
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
