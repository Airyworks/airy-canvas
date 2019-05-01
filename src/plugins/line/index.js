import { Graphics } from 'pixi.js'
import { cloneDeep } from 'lodash'
import Basic from '@/plugins/basic/'
import Node from './node'
import Component from './component'
import Setting from './setting'

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
    return 'basic-line'
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
    const line = new Node({ airy, stage }, this.setting)
    store.addNode(line)
    this.activeLine = line
    line.start(local.x, local.y)
    return false
  }

  moveWithMouse (_, { local }) {
    if (this.activeLine) {
      this.activeLine.move(local.x, local.y)
    }
    return true
  }

  endWithMouse () {
    this.activeLine = undefined
    return false
  }

  render ({ data }) {
    const line = new Graphics()
    line.position.set(data.points[0][0], data.points[0][1])
    line.lineStyle(2, data.color)
      .moveTo(0, 0)
      .lineTo(data.points[1][0], data.points[1][1])
    return line
  }
}
