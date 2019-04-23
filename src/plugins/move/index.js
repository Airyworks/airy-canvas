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

  beginWithMouse ({ app }, mouse) {
    // console.log(stage.pivot)
    this.start = {
      x: mouse.global.x,
      y: mouse.global.y
    }
    this.position = {
      x: app.stage.position.x,
      y: app.stage.position.y
    }
    return false
  }

  moveWithMouse ({ app }, mouse) {
    app.stage.position.x = mouse.global.x - this.start.x + this.position.x
    app.stage.position.y = mouse.global.y - this.start.y + this.position.y
    return true
  }

  active ({ viewport }) {}
  inactive ({ viewport }) {}
}
