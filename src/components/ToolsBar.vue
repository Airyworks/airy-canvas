<template>
  <div id="airy-toolsbar">
    <div v-for="item in tools" :key="item.name"
      @click="selectTool(item)" class="item"
      :class="{ 'item-focus': activeTool === item.name }">
      {{item.name}}
    </div>
    <div class="blank"></div>
    <div @click="revoke" class="item button">Revoke</div>
    <div @click="clear" class="item button">Clear</div>
    <div @click="save" class="item button">Save</div>
  </div>
</template>

<script>
import * as BrushLib from '@/model/brush'

const tools = [
  {
    type: 'Brush',
    name: 'Move'
  },
  {
    type: 'Brush',
    name: 'Pen'
  }
]

export default {
  name: 'ToolsBar',
  data () {
    return {
      tools,
      activeTool: 'Pen',
      airyCtx: {}
    }
  },
  methods: {
    bind (airyCtx) {
      this.airyCtx = airyCtx
    },
    selectTool (tool) {
      this.activeTool = tool.name
      if (tool.type === 'Brush') {
        this.$airyCtx.activeTool = new BrushLib[tool.name](this.$airyCtx.recorder)
      }
    },
    revoke () {
      this.$airyCtx.recorder.revoke()
    },
    clear () {
      this.$airyCtx.recorder.clear()
    },
    save () {
      const data = this.$airyCtx.recorder.tree.toString()
      const size = (data.length / 1024).toFixed(2) + 'KB'
      console.log(size)
    }
  }
}
</script>

<style lang="stylus">
#airy-toolsbar
  box-sizing border-box
  position absolute
  z-index 10
  width calc(100% - 4px)
  height 42px
  left 2px
  bottom 2px
  border-radius 4px
  padding 4px
  background-color #494949
  color #fff
  display flex
  .item
    height 30px
    width 60px
    font-size 12px
    margin 2px
    padding 4px 8px
    border-radius 4px
    box-sizing border-box
    display flex
    justify-content center
    align-items center
    cursor pointer
    user-select none
    border solid 1px #494949
  .item-focus
    background-color #313131
    border-color #5b5b5b
  .blank
    flex 1 1 100%
  .button
    transition text-shadow .2s
    &:hover
      text-shadow 0 0 4px #fff
</style>
