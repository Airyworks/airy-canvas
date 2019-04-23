import { Graphics } from 'pixi.js'
import Basic from '@/plugins/basic/'
import Component from './component'

export default class extends Basic {
  constructor () {
    super()
    this.color = 0x1099bb
    this.start = { x: 0, y: 0 }
  }

  get name () {
    return 'basic-line'
  }

  get component () {
    return Component
  }

  beginWithMouse ({ stage }, { local }) {
    const line = new Graphics()
    this.activeLine = line
    line.position.set(local.x, local.y)
    this.start = {
      x: local.x,
      y: local.y
    }
    stage.addChild(line)
    return false
  }

  moveWithMouse (_, { local }) {
    if (this.activeLine) {
      this.activeLine.clear()
      this.activeLine.lineStyle(2, this.color)
        .moveTo(0, 0)
        .lineTo(local.x - this.start.x, local.y - this.start.y)
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
