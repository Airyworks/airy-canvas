import Component from './component'
import { Container } from 'pixi.js'
// import Setting from './setting'

export default class {
  get name () {
    return 'basic-plugin'
  }

  get component () {
    return Component
  }

  get show () {
    return true
  }

  updateConfig (cfg) {}

  // get setting () {
  //   return Setting
  // }

  beginWithMouse ({ airy, app }, mouse) { return false }
  moveWithMouse ({ airy, app }, mouse) { return false }
  endWithMouse ({ airy, app }, mouse) { return false }

  active ({ app, viewport }) { return false }
  inactive ({ app, viewport }) { return false }

  render (container) {
    container.addChild(this.node || new Container())
  }
}
