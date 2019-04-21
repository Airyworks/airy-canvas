import { Point } from 'pixi.js'

export default class {
  constructor (mouse, state) {
    this.global = mouse.global.clone()

    // TODO: consider scaling
    this.local = new Point(
      mouse.global.x - state.position.x,
      mouse.global.y - state.position.y
    )

    // TODO: more useful info
  }
}
