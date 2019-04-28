import { cloneDeep } from 'lodash'
import Basic from '@/plugins/basic/'
import Node from './node'
import Component from './component'
import Setting from './setting'

const defaultSetting = {
  fill: '#ffffff',
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

  beginWithMouse ({ airy, stage }, { local }) {
    console.log(local)
    const text = new Node({ airy, stage }, this.setting)
    text.position(local)
    text.edit()
    text.render()
    return true
  }

  moveWithMouse (_, { local }) {}

  endWithMouse () {}

  render ({ data }) {}
}
