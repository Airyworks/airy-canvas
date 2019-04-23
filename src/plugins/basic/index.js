import Component from './component'

export default class {
  constructor () {
    console.log(this.component)
  }

  get name () {
    return 'basic-plugin'
  }

  get component () {
    return Component
  }

  beginWithMouse ({ app, viewport }, mouse) { return false }
  moveWithMouse ({ app, viewport }, mouse) { return false }
  endWithMouse ({ app, viewport }, mouse) { return false }

  active ({ app, viewport }) { return false }
  inactive ({ app, viewport }) { return false }

  render () {}
}
