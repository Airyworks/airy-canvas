<template>
  <div id="airy-toolsbar">
    <div v-for="item in tools" :key="item.name"
      @click="selectTool(item)" class="item"
      :class="{ 'item-focus': activeTool === item.name }">
      {{item.name}}
    </div>
  </div>
</template>

<script>
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
    }
  }
}
</script>

<style lang="stylus">
#airy-toolsbar
  position absolute
  left 2px
  bottom 2px
  border-radius 4px
  padding 4px
  background-color #494949
  color #fff
  display flex
  .item
    height 30px
    width 40px
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
  .item-focus
    background-color #313131
    border solid 1px #5b5b5b
</style>
