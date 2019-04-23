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

  beginWithMouse ({ airy, app }, mouse) {
    // console.log(stage.pivot)
    if (this.ani) this.clearAnimation(airy)
    airy.isAnimate = true
    this.prev = this.start = {
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
    this.speed = {
      x: mouse.global.x - this.prev.x,
      y: mouse.global.y - this.prev.y
    }
    this.prev = {
      x: mouse.global.x,
      y: mouse.global.y
    }
    app.stage.position.x = mouse.global.x - this.start.x + this.position.x
    app.stage.position.y = mouse.global.y - this.start.y + this.position.y
    return true
  }

  endWithMouse ({ airy, app }) {
    this.ani = (_, next) => {
      this.speed.x = this.speed.x * 0.85
      this.speed.y = this.speed.y * 0.85
      app.stage.position.x = this.speed.x + app.stage.position.x
      app.stage.position.y = this.speed.y + app.stage.position.y
      if (this.speed.x >= -1 && this.speed.x <= 1) this.speed.x = 0
      if (this.speed.y >= -1 && this.speed.y <= 1) this.speed.y = 0
      if (this.speed.x === 0 && this.speed.y === 0) {
        this.clearAnimation(airy)
      }
      next()
    }
    airy.addAnimateMiddleware(this.ani)
  }

  active ({ viewport }) {}
  inactive ({ viewport }) {}

  clearAnimation (airy) {
    airy.removeAnimateMiddleware(this.ani)
    this.ani = undefined
    airy.isAnimate = false
  }
}
