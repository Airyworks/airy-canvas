import { Point } from 'pixi.js'
import MouseEvent from '@/core/mouse-event'

const padding = {
  x: 10, y: 5
}

class Transform {
  constructor (airy, component) {
    this.airy = airy
    this.component = component
    this.status = false
    this.drag = false
    this.dragStart = null
    this.dragStartLocal = null
    this.dragStartGlobal = null
    this.padding = padding
    this.listener = {
      boxMouseDown: this.boxMouseDown.bind(this),
      boxMouseMove: this.boxMouseMove.bind(this),
      boxMouseUp: this.boxMouseUp.bind(this),
      containerMouseDown: this.containerMouseDown.bind(this)
    }
    this.box = document.createElement('div')
    this.lt = document.createElement('div')
    this.t = document.createElement('div')
    this.rt = document.createElement('div')
    this.lm = document.createElement('div')
    this.rm = document.createElement('div')
    this.lb = document.createElement('div')
    this.b = document.createElement('div')
    this.rb = document.createElement('div')
    this.points = [this.lt, this.t, this.rt, this.lm, this.rm, this.lb, this.b, this.rb]
    for (const point of this.points) {
      this.box.appendChild(point)
    }
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
    const node = this.component.node
    if (node && this.status) {
      this.status = false
      this.airy.container.removeChild(this.box)
      if (this.sheet) {
        this.sheet.detach()
      }
    }
  }

  initBox () {
  }

  drawBox (node) {
    const location = this.component.getGlobalLocation()

    const styles = {
      box: {
        position: 'absolute',
        left: `${location.x - this.padding.x}px`,
        top: `${location.y - this.padding.y}px`,
        padding: `${this.padding.y}px ${this.padding.x}px`,
        width: `${node.width + 2 * this.padding.x}px`,
        height: `${node.height + 2 * this.padding.y}px`,
        border: `1px solid #ffbd01`,
        boxSizing: 'border-box',
        cursor: 'move'
      },
      points: {
        position: 'absolute',
        width: `6px`,
        height: `6px`,
        borderRadius: `50%`,
        border: `1px solid #43abf4`,
        background: `#ffffff`,
        cursor: 'pointer'
      },
      lt: {
        left: 0,
        top: 0,
        transform: `translate(-50%, -50%)`
      },
      t: {
        left: `50%`,
        top: 0,
        transform: `translate(-50%, -50%)`
      },
      rt: {
        right: 0,
        top: 0,
        transform: `translate(50%, -50%)`
      },
      lm: {
        left: 0,
        top: `50%`,
        transform: `translate(-50%, -50%)`
      },
      rm: {
        right: 0,
        top: `50%`,
        transform: `translate(50%, -50%)`
      },
      lb: {
        left: 0,
        bottom: 0,
        transform: `translate(-50%, 50%)`
      },
      b: {
        left: `50%`,
        bottom: 0,
        transform: `translate(-50%, 50%)`
      },
      rb: {
        right: 0,
        bottom: 0,
        transform: `translate(50%, 50%)`
      }
    }

    this.sheet = this.airy.jss.createStyleSheet(styles)
    this.sheet.attach()
    const { classes } = this.sheet

    this.box.className = classes.box
    this.lt.classList = `${classes.points} ${classes.lt}`
    this.t.classList = `${classes.points} ${classes.t}`
    this.rt.classList = `${classes.points} ${classes.rt}`
    this.lm.classList = `${classes.points} ${classes.lm}`
    this.rm.classList = `${classes.points} ${classes.rm}`
    this.lb.classList = `${classes.points} ${classes.lb}`
    this.b.classList = `${classes.points} ${classes.b}`
    this.rb.classList = `${classes.points} ${classes.rb}`
  }

  render () {
    this.airy.container.appendChild(this.box)
    setTimeout(() => {
      this.box.addEventListener('mousedown', this.listener.boxMouseDown)
      this.airy.container.addEventListener('mousemove', this.listener.boxMouseMove)
      this.airy.container.addEventListener('mouseup', this.listener.boxMouseUp)
      this.airy.container.addEventListener('mousedown', this.listener.containerMouseDown)
    }, 100)
  }

  unfocus () {
    this.airy.store.unfocus()
    this.box.removeEventListener('mousedown', this.listener.boxMouseDown)
    this.airy.container.removeEventListener('mousemove', this.listener.boxMouseMove)
    this.airy.container.removeEventListener('mouseup', this.listener.boxMouseUp)
    this.airy.container.removeEventListener('mousedown', this.listener.containerMouseDown)
  }

  boxMouseDown (e) {
    e.stopPropagation()
    this.drag = true
    this.dragStart = new MouseEvent(e, this.airy.app.stage)
    this.dragStartLocal = new Point(this.component.node.position.x, this.component.node.position.y)
    this.dragStartGlobal = this.component.getGlobalLocation()
  }

  boxMouseMove (e) {
    e.stopPropagation()
    if (this.drag) {
      // move pixi node
      const dragCurr = new MouseEvent(e, this.airy.app.stage)
      const { x: localX, y: localY } = this.dragStartLocal
      const newLocal = new Point(localX + dragCurr.local.x - this.dragStart.local.x,
        localY + dragCurr.local.y - this.dragStart.local.y)
      this.component.updatePositoin(newLocal)
      // move dom node
      const { x: globalX, y: globalY } = this.dragStartGlobal
      const newGlobal = new Point(globalX - this.padding.x + dragCurr.global.x - this.dragStart.global.x,
        globalY - this.padding.y + dragCurr.global.y - this.dragStart.global.y)
      this.box.style.left = `${newGlobal.x}px`
      this.box.style.top = `${newGlobal.y}px`
    }
  }

  boxMouseUp (e) {
    e.stopPropagation()
    this.drag = false
    this.dragStart = null
    this.dragStartLocal = null
    this.dragStartGlobal = null
  }

  containerMouseDown (e) {
    this.unfocus()
  }
}

export default Transform
