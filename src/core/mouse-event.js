import { Point } from 'pixi.js'

export default class {
  constructor (mouse, state) {
    if (mouse.global) {
      this.global = mouse.global.clone()
    } else {
      this.global = new Point(
        mouse.clientX,
        mouse.clientY
      )
    }

    // TODO: consider scaling
    this.local = new Point(
      this.global.x - state.position.x,
      this.global.y - state.position.y
    )

    // TODO: more useful info
  }
}
