import BasicNode from '@/plugins/basic/node'
import { Graphics, Point } from 'pixi.js'

export default class extends BasicNode {
  constructor ({ airy, stage }, { color }) {
    super()
    this.airy = airy
    this.stage = stage
    this.color = color
    this.node = new Graphics()
    this.startPoint = new Point(0, 0)
  }

  render () {
    this.stage.addChild(this.node)
  }

  start (x, y) {
    this.startPoint = new Point(x, y)
    this.node.position = this.startPoint
  }

  move (x, y) {
    this.node.clear()
    this.node.lineStyle(2, this.color)
      .moveTo(0, 0)
      .lineTo(x - this.startPoint.x, y - this.startPoint.y)
  }
}
