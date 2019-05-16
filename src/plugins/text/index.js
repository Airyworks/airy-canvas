import { cloneDeep } from 'lodash'
import Basic from '@/plugins/basic/'
import Node from './node'
import Component from './component'
import Setting from './setting'

const defaultSetting = {
  fill: '#000000',
  breakWords: true,
  fontFamily: 'sans-serif',
  fontSize: 24,
  fontStyle: 'normal',
  wordWrap: false,
  wordWrapWidth: 100,
  letterSpacing: 0,
  lineHeight: 27,
  under: false,
  dropShadow: false,
  dropShadowColor: '#000000',
  stroke: 'black',
  strokeThickness: 0
}

export default class extends Basic {
  constructor () {
    super()
    this.setting = cloneDeep(defaultSetting)
  }

  get name () {
    return 'basic-text'
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
    console.log('create text')
    const text = new Node({ airy, stage }, this.setting)
    // text.position(local)
    store.addNode(text)
    store.commit(text, 'position', local)
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
