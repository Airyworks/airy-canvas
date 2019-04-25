import { Point } from 'pixi.js'

export default class {
  constructor (mouse, stage) {
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
      (this.global.x - stage.position.x) / stage.scale.x + stage.pivot.x,
      (this.global.y - stage.position.y) / stage.scale.y + stage.pivot.y
    )

    // TODO: more useful info
  }
}
