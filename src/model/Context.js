'use strict'

export default class Context {
  constructor () {
    this.activeTool = null
    this.cursor = null
    this.cursorActive = null
  }

  setActiveTool (tool) {
    this.activeTool = tool
    if (tool.cursor) {
      this.cursor = tool.cursor
    }
    if (tool.cursorActive) {
      this.cursorActive = tool.cursorActive
    }
  }

  getCursor (isActive) {
    if (isActive && this.cursorActive) {
      return this.cursorActive + ', default'
    } else if (this.cursor) {
      return this.cursor + ', default'
    } else {
      return 'default'
    }
  }
}
