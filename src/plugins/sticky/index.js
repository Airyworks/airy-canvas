import { cloneDeep } from 'lodash'
import Basic from '@/plugins/basic/'
import Node from './node'
import Component from './component'
import Setting from './setting'
import cfg from './airy.plugin'

export default class extends Basic {
  constructor () {
    super()
    this.Node = Node
    this.setting = cloneDeep(cfg.defaultSetting)
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
    const sticky = new Node({ airy, stage }, this.setting)
    this.activeNode = sticky
    store.addNode(sticky)
    store.action(sticky, 'position', local)
    airy.store.focus(sticky.uuid)
    return true
  }

  moveWithMouse (_, { local }) {}

  endWithMouse ({ store }) {
    store.commit(this.activeNode.uuid)
  }

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
