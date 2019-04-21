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

  beginWithMouse (mouse, stage) {}
  moveWithMouse (mouse) {}
  endWithMouse (mouse) {}

  render () {}
}
