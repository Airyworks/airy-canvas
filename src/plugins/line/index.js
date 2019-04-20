import { Graphics } from 'pixi.js'
import Component from './component'

export default class {
  constructor () {
    this.a = 1
  }

  get name () {
    return 'basic-line'
  }

  get component () {
    return Component
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
