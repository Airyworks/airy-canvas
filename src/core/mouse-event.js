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

    console.log(this.global.x, stage.position.x, stage.pivot.x, stage.scale.x)

    // TODO: consider scaling
    this.local = new Point(
      this.global.x / stage.scale.x - stage.position.x,
      this.global.y / stage.scale.y - stage.position.y
    )

    // TODO: more useful info
  }
}
