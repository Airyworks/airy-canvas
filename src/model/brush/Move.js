'use strict'

import Brush from './Brush'
// import Cursor from '@/model/Cursor'

export default class Move extends Brush {
  constructor (recorder) {
    super(recorder, 'Move')

    this._active = false
    this.needUpdate = false

    this.updateXY(0, 0)
  }

  get paletteConfig () {
    return []
  }

  stringify () {
    return '<Move>'
  }

  beginAtPos (x, y) {
    this.updateXY(x, y)
    this._active = true
    // this.needUpdate = true
  }

  moveAtPos (x, y) {
    if (!this._active) {
      return
    }
    this.recorder.offsetX += x - this.storeX
    this.recorder.offsetY += y - this.storeY
    this.updateXY(x, y)
    this.needUpdate = true
  }

  endAtPos (x, y) {
    if (!this._active) {
      return false
    }
    this._active = false
    this.recorder.offsetX += x - this.storeX
    this.recorder.offsetY += y - this.storeY
    this.needUpdate = true
    return false
  }

  updateWithActiveLayer (layer) {
    this.needUpdate = false
  }

  updateXY (x, y) {
    this.storeX = x
    this.storeY = y
  }
}
