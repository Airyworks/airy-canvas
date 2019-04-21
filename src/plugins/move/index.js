import Basic from '@/plugins/basic/'
import Component from './component'
import cfg from './airy.plugin'

export default class extends Basic {
  get component () {
    return Component
  }

  get name () {
    return cfg.name
  }

  beginWithMouse (mouse, { stage }) {
    console.log(stage.pivot)
    this.start = {
      x: mouse.global.x,
      y: mouse.global.y
    }
    this.cameraPivot = {
      x: stage.pivot.x,
      y: stage.pivot.y
    }
  }

  moveWithMouse (mouse, { stage }) {
    stage.pivot.x = this.start.x - mouse.global.x + this.cameraPivot.x
    stage.pivot.y = this.start.y - mouse.global.y + this.cameraPivot.y
  }

  // endWithMouse (mouse) {
  //   this.path = simplify(this.path)
  //   this.ctrlPoints = genControlPoints(this.path)
  //   this.updateLineByPath()
  // }
}
