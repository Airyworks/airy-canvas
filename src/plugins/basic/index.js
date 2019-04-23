import Component from './component'

export default class {
  get name () {
    return 'basic-plugin'
  }

  get component () {
    return Component
  }

  beginWithMouse ({ airy, app }, mouse) { return false }
  moveWithMouse ({ airy, app }, mouse) { return false }
  endWithMouse ({ airy, app }, mouse) { return false }

  active ({ app, viewport }) { return false }
  inactive ({ app, viewport }) { return false }

  render () {}
}
