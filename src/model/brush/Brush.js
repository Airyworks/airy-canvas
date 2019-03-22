'use strict'

export default class Brush {
  constructor (recorder, name) {
    this.recorder = recorder
    this.name = name

    this.cursor = null
    this.cursorActive = null
  }

  stringify () {
    console.warn(`Brush<${this.name}> Need to implement the stringify method`)
  }
  beginAtPos (x, y) {
    console.warn(`Brush<${this.name}> Need to implement the beginAtPos method`)
  }
  moveAtPos (x, y) {
    console.warn(`Brush<${this.name}> Need to implement the moveAtPos method`)
  }
  endAtPos (x, y) {
    console.warn(`Brush<${this.name}> Need to implement the endAtPos method`)
  }
}
