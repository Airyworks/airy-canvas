import { Graphics } from 'pixi.js'

const padding = {
  x: 10, y: 5
}

class Transform {
  constructor (airy, component) {
    this.airy = airy
    this.component = component
    this.status = false
    this.box = new Graphics()
    this.lt = new Graphics()
    this.t = new Graphics()
    this.rt = new Graphics()
    this.lm = new Graphics()
    this.rm = new Graphics()
    this.lb = new Graphics()
    this.b = new Graphics()
    this.rb = new Graphics()
    this.points = [this.lt, this.t, this.rt, this.lm, this.rm, this.lb, this.b, this.rb]
  }

  show () {
    const node = this.component.node
    if (node && !this.status) {
      this.status = true
      this.drawBox(node)
      this.render()
      this.airy.needUpdate = true
    }
  }

  hide () {
    // const node = this.component.node
    // if (node && this.status) {
    //   this.status = false
    //   this.drawBox()
    //   this.airy.app.stage.removeChild(this.box)
    //   this.airy.needUpdate = true
    // }
  }

  drawBox (node) {
    if (node.hitArea) {
      // pixi graphics support
      node = node.hitArea
    }
    this.box.clear()
    this.box.lineStyle(1, 0xFFBD01, 0.8)
    this.box.drawRect(node.x - padding.x, node.y - padding.y, node.width + 2 * padding.x, node.height + 2 * padding.y)

    for (const point of this.points) {
      point.clear()
    }

    this.lt.lineStyle(1, 0x43abf4, 0.8)
    this.lt.beginFill(0xffffff, 1)
    this.lt.drawCircle(node.x - padding.x, node.y - padding.y, 5)
    this.lt.endFill()

    this.t.lineStyle(1, 0x43abf4, 0.8)
    this.t.beginFill(0xffffff, 1)
    this.t.drawCircle(node.x + node.width / 2, node.y - padding.y, 5)
    this.t.endFill()

    this.rt.lineStyle(1, 0x43abf4, 0.8)
    this.rt.beginFill(0xffffff, 1)
    this.rt.drawCircle(node.x + node.width + padding.x, node.y - padding.y, 5)
    this.rt.endFill()

    this.lm.lineStyle(1, 0x43abf4, 0.8)
    this.lm.beginFill(0xffffff, 1)
    this.lm.drawCircle(node.x - padding.x, node.y + node.height / 2, 5)
    this.lm.endFill()

    this.rm.lineStyle(1, 0x43abf4, 0.8)
    this.rm.beginFill(0xffffff, 1)
    this.rm.drawCircle(node.x + node.width + padding.x, node.y + node.height / 2, 5)
    this.rm.endFill()

    this.lb.lineStyle(1, 0x43abf4, 0.8)
    this.lb.beginFill(0xffffff, 1)
    this.lb.drawCircle(node.x - padding.x, node.y + node.height + padding.y, 5)
    this.lb.endFill()

    this.b.lineStyle(1, 0x43abf4, 0.8)
    this.b.beginFill(0xffffff, 1)
    this.b.drawCircle(node.x + node.width / 2, node.y + node.height + padding.y, 5)
    this.b.endFill()

    this.rb.lineStyle(1, 0x43abf4, 0.8)
    this.rb.beginFill(0xffffff, 1)
    this.rb.drawCircle(node.x + node.width + padding.x, node.y + node.height + padding.y, 5)
    this.rb.endFill()
  }

  render () {
    this.airy.app.stage.addChild(this.box)
    for (const point of this.points) {
      this.airy.app.stage.addChild(point)
    }
  }
}

export default Transform
