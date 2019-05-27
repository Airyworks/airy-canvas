import { cloneDeep } from 'lodash'
import Basic from '@/plugins/basic/'
import Node from './node'
import Component from './component'
import Setting from './setting'
import cfg from './airy.plugin'

const defaultSetting = cfg.defaultSetting

export default class extends Basic {
  constructor () {
    super()
    this.setting = cloneDeep(defaultSetting)
  }

  get name () {
    return cfg.name
  }

  get component () {
    return Component
  }

  get settingPanel () {
    return Setting
  }

  updateSetting (cfg) {
    this.setting = Object.assign(this.setting, cfg)
  }

  beginWithMouse ({ airy, stage, store }, { local }) {
    const text = new Node({ airy, stage }, this.setting)
    store.addNode(text)
    store.commit(text, 'position', local)
    airy.store.focus(text.uuid)
    return true
  }

  moveWithMouse (_, { local }) {}

  endWithMouse () {}

  render ({ data }) {}

  // stringify () {
  //   let output = `<BRUSH>${this.color};${this.width.toFixed(2)};${this.alpha.toFixed(2)};`
  //   output += toFixed(this.path[0].x) + ',' + toFixed(this.path[0].y)
  //   this.path.reduce((last, point) => {
  //     output += `,${toFixed(point.x - last.x)},${toFixed(point.y - last.y)}`
  //     return point
  //   }, this.path[0])
  //   return output
  // }
}
