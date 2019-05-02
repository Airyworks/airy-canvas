import BasicNode from '@/plugins/basic/node'
import { Graphics, Point } from 'pixi.js'

export default class extends BasicNode {
  constructor (_, setting) {
    super()
    this.setting = setting
    this.node = new Graphics()
    this.startPoint = new Point(0, 0)
  }

  clear () {
    this.node.clear()
  }

  lineStyle (payload) {
    this.node.lineStyle(...payload)
  }

  moveTo (payload) {
    this.node.moveTo(...payload)
  }

  bezierCurveTo (payload) {
    this.node.bezierCurveTo(...payload)
  }

  lineTo (payload) {
    this.node.lineTo(...payload)
  }
}
