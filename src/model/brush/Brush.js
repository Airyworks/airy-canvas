'use strict'

export default class Brush {
  constructor (recorder, name) {
    this.recorder = recorder
    this.name = name

    this.cursor = null
    this.cursorActive = null
  }

  get paletteConfig () {
    console.warn(`Brush<${this.name}> The attribute 'paletteConfig' needs to be overloaded`)
    return []
  }

  stringify () {
    console.warn(`Brush<${this.name}> The function 'stringify' needs to be overloaded`)
  }
  beginAtPos (x, y) {
    console.warn(`Brush<${this.name}> The function 'beginAtPos' needs to be overloaded`)
  }
  moveAtPos (x, y) {
    console.warn(`Brush<${this.name}> The function 'moveAtPos' needs to be overloaded`)
  }
  endAtPos (x, y) {
    console.warn(`Brush<${this.name}> The function 'endAtPos' needs to be overloaded`)
  }
}
