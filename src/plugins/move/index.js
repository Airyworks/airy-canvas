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
    this.position = {
      x: stage.position.x,
      y: stage.position.y
    }
  }

  moveWithMouse (mouse, { stage }) {
    stage.position.x = mouse.global.x - this.start.x + this.position.x
    stage.position.y = mouse.global.y - this.start.y + this.position.y
  }
}
