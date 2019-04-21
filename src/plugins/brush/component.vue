<template>
  <div class="airy-canvas-common-plugin">
    <font-awesome-icon
      :icon="icon"
      size="1x"
    />
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaintBrush } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'BrushIcon',
  components: {
    FontAwesomeIcon
  },
  computed: {
    icon () {
      return faPaintBrush
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
