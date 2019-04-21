import { Graphics } from 'pixi.js'
import Component from './component'

export default class {
  constructor () {
    this.width = 2
    this.color = 0x1099bb

    this.activeLine = null
    this.path = []
  }

  get name () {
    return 'basic-brush'
  }

  get component () {
    return Component
  }

  beginWithMouse (mouse, state) {
    const line = new Graphics()
    this.activeLine = line
    this.path = [{
      x: mouse.global.x,
      y: mouse.global.y
    }]
    state.addChild(line)
    this.updateLineByPath()
  }

  moveWithMouse (mouse) {
    this.path.push({
      x: mouse.global.x,
      y: mouse.global.y
    })
    this.updateLineByPath()
  }

  endWithMouse (mouse) {
    // TODO: simplify
  }

  updateLineByPath () {
    if (!this.path.length) {
      return
    }
    this.activeLine.clear()
    this.activeLine.lineStyle(this.width, this.color)
    this.path.forEach((point, index) => {
      if (index) {
        this.activeLine.lineTo(point.x, point.y)
      } else {
        this.activeLine.moveTo(point.x, point.y)
      }
    })
  }

  render ({ data }) {
    const line = new Graphics()
    line.position.set(data.points[0][0], data.points[0][1])
    line.lineStyle(2, data.color)
      .moveTo(0, 0)
      .lineTo(data.points[1][0], data.points[1][1])
    console.log(line)
    return line
  }
}
