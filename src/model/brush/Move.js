'use strict'

import Brush from './Brush'
// import Cursor from '@/model/Cursor'

export default class Move extends Brush {
  constructor (recorder) {
    super(recorder, 'Move')

    this._active = false
    this.needUpdate = false

    this._init()
  }

  get paletteConfig () {
    return []
  }

  stringify () {
    return '<Move>'
  }

  beginAtPos (x, y) {
    this._init()
    this._active = true
    this.needUpdate = true
  }

  moveAtPos (x, y) {
    if (!this._active) {
      return
    }
    this.needUpdate = true
  }

  endAtPos (x, y) {
    if (!this._active) {
      return false
    }
    this._active = false
    this.needUpdate = true
    return false
  }

  updateWithActiveLayer (layer) {
    this.needUpdate = false
  }

  _init () {
    // TODO
  }
}
