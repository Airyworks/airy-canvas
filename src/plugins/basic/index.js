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

  render () {}
}
