import { cloneDeep } from 'lodash'
import { Graphics, Point, Rectangle } from 'pixi.js'
import BasicNode from '@/plugins/basic/node'
import cfg from './airy.plugin'
import { toFixed } from '@/utils/number'
import { simplify, genControlPoints } from './utils'

export default class extends BasicNode {
  constructor ({ airy }, setting, meta) {
    super(airy, meta)
    this.type = cfg.name
    this.setting = cloneDeep(setting)
    this.node = new Graphics()
    this.startPoint = new Point(0, 0)
    this.area = {
      minx: null,
      miny: null,
      maxx: null,
      maxy: null
    }
    this.path = []
    this.ctrlPoints = []
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

  push (localPoint) {
    this.path.push(localPoint)
  }

  updateLineByPath () {
    const setting = this.setting
    if (!this.path.length) {
      return
    }
    this.clear()
    this.lineStyle([setting.width, setting.color, setting.alpha, 0.5])
    this.path.forEach((point, index) => {
      if (!index) {
        this.moveTo([point.x, point.y])
      } else if (this.ctrlPoints.length) {
        const cp1 = this.ctrlPoints[index - 1].right
        const cp2 = this.ctrlPoints[index].left
        this.bezierCurveTo([cp1.x, cp1.y, cp2.x, cp2.y, point.x, point.y])
      } else {
        this.lineTo([point.x, point.y])
      }
    })
  }

  simplifyPath () {
    this.path = simplify(this.path)
  }

  generateControlPoints () {
    this.ctrlPoints = genControlPoints(this.path)
  }

  hitArea () {
    // graphics require hit area to be selected
    this.node.hitArea = new Rectangle(this.area.minx, this.area.miny,
      this.area.maxx - this.area.minx, this.area.maxy - this.area.miny)
  }

  onclick () {
    // console.log('brush onclick', this.node.hitArea)
  }

  stringify () {
    const setting = this.setting
    let output = `<${this.type}>0x${setting.color.toString(16)};${setting.width.toFixed(2)};${setting.alpha.toFixed(2)};`
    output += toFixed(this.path[0].x) + '|' + toFixed(this.path[0].y)
    this.path.reduce((last, point) => {
      output += `,${toFixed(point.x)}|${toFixed(point.y)}`
      return point
    }, this.path[0])
    return output
  }

  getData () {
    return {
      setting: this.setting,
      path: this.path
    }
  }

  fromData (data) {
    Object.assign(this.setting, data.setting || {})
    this.path = data.path.map(point => {
      return new Point(point.x, point.y)
    })
    this.generateControlPoints()
    this.updateLineByPath()
  }

  fromDataOld (data) {
    const dataParseReg = /(0x[0-9a-z]{6});([0-9.]+);([0-9.]+);([0-9.\-,|]+)$/
    const [ , color, width, alpha, pointStr ] = data.match(dataParseReg)
    this.setting.color = parseInt(color, 16)
    this.setting.width = parseFloat(width)
    this.setting.alpha = parseFloat(alpha)
    const points = pointStr.split(',').map(point => {
      const [ x, y ] = point.split('|')
      return new Point(parseFloat(x), parseFloat(y))
    })
    this.path = points
    this.generateControlPoints()
    this.updateLineByPath()
  }
}
