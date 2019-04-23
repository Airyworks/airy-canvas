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

  beginWithMouse (app, mouse) { return false }
  moveWithMouse (app, mouse) { return false }
  endWithMouse (app, mouse) { return false }

  render () {}
}
