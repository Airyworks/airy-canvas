import BasicNode from '@/plugins/basic/node'
import { Graphics, Point, Rectangle } from 'pixi.js'

export default class extends BasicNode {
  constructor ({ airy }, setting) {
    super(airy)
    this.setting = setting
    this.node = new Graphics()
    this.startPoint = new Point(0, 0)
    this.area = {
      minx: null,
      miny: null,
      maxx: null,
      maxy: null
    }
  }

  clear () {
    this.node.clear()
  }

  lineStyle (payload) {
    this.node.lineStyle(...payload)
    this.hitArea()
  }

  moveTo (payload) {
    this.node.moveTo(...payload)
    this.area.minx = payload[0]
    this.area.miny = payload[1]
    this.area.maxx = payload[0]
    this.area.maxy = payload[1]
  }

  bezierCurveTo (payload) {
    this.node.bezierCurveTo(...payload)
    if (this.area.minx > payload[0]) {
      this.area.minx = payload[0]
    }
    if (this.area.miny > payload[1]) {
      this.area.miny = payload[1]
    }
    if (this.area.maxx < payload[0]) {
      this.area.maxx = payload[0]
    }
    if (this.area.maxy < payload[1]) {
      this.area.maxy = payload[1]
    }
    this.hitArea()
  }

  lineTo (payload) {
    this.node.lineTo(...payload)
  }

  hitArea () {
    // this.node.hitArea = new Rectangle(this.node.x, this.node.y, this.node.width, this.node.height)
    // this.node.hitArea = new Rectangle(this.node.x, this.node.y, this.node.width, this.node.height)
    console.log(this.area)
    this.node.hitArea = new Rectangle(this.area.minx, this.area.miny,
      this.area.maxx - this.area.minx, this.area.maxy - this.area.miny)
  }

  onclick () {
    // console.log('brush onclick', this.node.hitArea)
  }
}
