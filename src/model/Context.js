'use strict'

const events = [
  'changetool'
]

export default class Context {
  constructor () {
    this._recorder = null
    this._activeTool = null
    this.cursor = null
    this.cursorActive = null

    this.handles = new Map()
  }

  on (event, callback) {
    if (!events.includes(event)) {
      console.error(`There is no event ${event} on Context`)
      return
    }
    const handles = this.handles.get(event) || []
    handles.push(callback)
    this.handles.set(event, handles)
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
    this.cursor = tool.cursor
    this.cursorActive = tool.cursorActive
    const handles = this.handles.get('changetool')
    if (handles) {
      handles.forEach(cb => {
        cb()
      })
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
