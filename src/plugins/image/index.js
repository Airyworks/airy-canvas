import { cloneDeep } from 'lodash'
import Basic from '@/plugins/basic/'
// import Node from './node'
import Component from './component'

const defaultSetting = {
  thick: 2,
  color: 0x1099bb
}

export default class extends Basic {
  constructor () {
    super()
    this.setting = cloneDeep(defaultSetting)
    this.color = 0x1099bb
    this.start = { x: 0, y: 0 }
  }

  get name () {
    return 'basic-image'
  }

  get component () {
    return Component
  }

  get show () {
    return false
  }

  beginWithMouse ({ airy, stage }, { local }) {}

  moveWithMouse (_, { local }) {}

  endWithMouse () {}

  render ({ data }) {}
}
