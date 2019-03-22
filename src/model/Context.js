'use strict'

export default class Context {
  constructor () {
    this._recorder = null
    this._activeTool = null
    this.cursor = null
    this.cursorActive = null
  }
  set recorder (recorder) {
    if (!this._recorder) {
      this._recorder = recorder
    }
  }
  get recorder () {
    return this._recorder
  }

  set activeTool (tool) {
    this._activeTool = tool
    if (tool.cursor) {
      this.cursor = tool.cursor
    }
    if (tool.cursorActive) {
      this.cursorActive = tool.cursorActive
    }
  }
  get activeTool () {
    return this._activeTool
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
