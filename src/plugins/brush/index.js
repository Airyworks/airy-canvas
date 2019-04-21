import Basic from '@/plugins/basic/'
import Component from './component'

export default class extends Basic {
  // constructor () {}

  get name () {
    return 'basic-brush'
  }

  get component () {
    return Component
  }
}
