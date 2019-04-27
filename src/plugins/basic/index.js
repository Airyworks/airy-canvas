import Component from './component'
// import Setting from './setting'

export default class {
  get name () {
    return 'basic-plugin'
  }

  get component () {
    return Component
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

  render () {}
}
