import BasicNode from '@/plugins/basic/node'
import { Text } from 'pixi.js'

export default class extends BasicNode {
  constructor ({ airy, stage }, setting) {
    super()
    this.airy = airy
    this.stage = stage
    this.setting = setting

    this.node = new Text('Rich text with a lot of options and across multiple lines', this.setting)
  }

  render () {
    this.stage.addChild(this.node)
  }

  position (local) {
    this.node.x = local.x
    this.node.y = local.y
  }

  edit () {}
}
