import BasicNode from '@/plugins/basic/node'
import { Graphics, Point } from 'pixi.js'

export default class extends BasicNode {
  constructor ({ airy, stage }, setting) {
    super()
    this.airy = airy
    this.stage = stage
    this.setting = setting
    this.node = new Graphics()
    this.startPoint = new Point(0, 0)
  }

  start (x, y) {
    this.startPoint = new Point(x, y)
    this.node.position = this.startPoint
  }

  move ({ x, y }) {
    console.log(x, y)
    this.node.clear()
    this.node.lineStyle(this.setting.thick, this.setting.color)
      .moveTo(0, 0)
      .lineTo(x - this.startPoint.x, y - this.startPoint.y)
  }
}
