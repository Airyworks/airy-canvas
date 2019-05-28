import { Graphics } from 'pixi.js'
import { cloneDeep } from 'lodash'
import Basic from '@/plugins/basic/'
import Component from './component'
import Node from './node'
import cfg from './airy.plugin'
import { genControlPoints } from './utils'

export default class extends Basic {
  constructor () {
    super()
    this.Node = Node
    this.setting = cloneDeep(cfg.defaultSetting)

    this.activeNode = null
    this.path = []
    this.ctrlPoints = []
  }

  get name () {
    return cfg.name
  }

  get component () {
    return Component
  }

  beginWithMouse ({ airy, stage, store }, mouse) {
    const node = new Node({ airy, stage }, this.setting)
    this.activeNode = node

    store.addNode(node)
    store.action(this.activeNode, 'push', mouse.local)
    store.action(this.activeNode, 'updateLineByPath')
    return false
  }

  moveWithMouse ({ store }, mouse) {
    this.path.push(mouse.local)
    store.action(this.activeNode, 'push', mouse.local)
    store.action(this.activeNode, 'updateLineByPath')
    return true
  }

  endWithMouse ({ store }) {
    if (!this.path.length) {
      return
    }
    store.action(this.activeNode, 'simplifyPath')
    store.action(this.activeNode, 'generateControlPoints')
    store.action(this.activeNode, 'updateLineByPath')
    store.commit(this.activeNode.uuid)
    return true
  }

  render ({ viewport }, data) {
    const segment = data.split(';')
    const [color, width, alpha] = segment.slice(0, -1)
    const points = segment.slice(-1)[0].split(',').map(s => Number(s))
    const path = [{
      x: points[0],
      y: points[1]
    }]
    for (let i = 2; i < points.length; i += 2) {
      path.push({
        x: points[i] + points[i - 2],
        y: points[i + 1] + points[i - 1]
      })
    }
    const ctrlPoints = genControlPoints(path)
    const line = new Graphics()
    line.lineStyle(width, color, alpha, 0.5)
    path.forEach((point, index) => {
      if (!index) {
        line.moveTo(point.x, point.y)
      } else {
        const cp1 = ctrlPoints[index - 1].right
        const cp2 = ctrlPoints[index].left
        line.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, point.x, point.y)
      }
    })
    viewport.addChild(line)
    return line
  }
}
