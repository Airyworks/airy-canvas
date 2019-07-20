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

    this.bar = null
  }

  getBar () {
    const domContainer = document.createElement('div')
    const barBox = document.createElement('div')
    domContainer.appendChild(barBox)
    const style = {
      '@keyframes barShowup': {
        from: {
          opacity: 0,
          transform: 'translateY(50%)'
        },
        to: {
          opacity: 1,
          transform: 'translateY(0)'
        }
      },
      barContainer: {
        position: 'absolute',
        left: `50%`,
        top: `-50px`,
        boxSizing: 'border-box',
        cursor: 'move',
        padding: `${this.padding.y}px ${this.padding.x}px`,
        animationName: '$barShowup',
        animationDuration: '0.5s'
      },
      barBox: {
        position: 'absolute',
        left: 0,
        top: 0,
        background: '#fff',
        transform: 'translateX(-50%)',
        padding: '5px',
        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.12)'
      },
      ...this.component.submenu.getStyles()
    }
    barBox.appendChild(this.component.submenu.getContent())
    this.bar = {
      dom: domContainer,
      barBox: barBox,
      style
    }
    this.box.appendChild(this.bar.dom)
  }

  getContentActions () {
    const actions = document.createElement('div')
    return actions
  }

  show () {
    const node = this.component.node
    if (node && !this.status) {
      this.status = true
      this.getBar()
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

  drawBox (node) {
    const location = this.component.getGlobalPosition()
    const { x: stageScaleX, y: stageScaleY } = this.airy.app.stage.scale

    const styles = {
      box: {
        position: 'absolute',
        left: `${location.x - this.padding.x}px`,
        top: `${location.y - this.padding.y}px`,
        padding: `${this.padding.y}px ${this.padding.x}px`,
        width: `${node.width * node.scale.x * stageScaleX + 2 * this.padding.x}px`,
        height: `${node.height * node.scale.y * stageScaleY + 2 * this.padding.y}px`,
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
      },
      ...this.bar.style
    }

    this.sheet = this.airy.jss.createStyleSheet(styles)
    this.sheet.attach()
    const { classes } = this.sheet

    this.box.removeAttribute('style')
    this.box.className = classes.box
    this.lt.classList = `${classes.points} ${classes.lt}`
    this.t.classList = `${classes.points} ${classes.t}`
    this.rt.classList = `${classes.points} ${classes.rt}`
    this.lm.classList = `${classes.points} ${classes.lm}`
    this.rm.classList = `${classes.points} ${classes.rm}`
    this.lb.classList = `${classes.points} ${classes.lb}`
    this.b.classList = `${classes.points} ${classes.b}`
    this.rb.classList = `${classes.points} ${classes.rb}`
    this.bar.dom.className = classes.barContainer
    this.bar.barBox.className = classes.barBox
    this.component.submenu.mountStyle(this.sheet)
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
    if (e.stopPropagation) {
      e.stopPropagation()
    }
    this.drag = true
    this.dragStart = new MouseEvent(e, this.airy.app.stage)
    this.dragStartLocal = this.component.getLocalPosition()
    this.dragStartGlobal = this.component.getGlobalPosition()
    console.log(this.dragStart)
  }

  boxMouseMove (e) {
    e.stopPropagation()
    if (this.drag) {
      // move pixi node
      const dragCurr = new MouseEvent(e, this.airy.app.stage)
      const { x: localX, y: localY } = this.dragStartLocal
      const newLocal = new Point(localX + dragCurr.local.x - this.dragStart.local.x,
        localY + dragCurr.local.y - this.dragStart.local.y)
      this.component.updateLocalPositoin(newLocal)
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

  resize (width, height) {
    // input size without padding
    const node = this.component.node
    const { x: stageScaleX, y: stageScaleY } = this.airy.app.stage.scale
    this.box.style.width = `${width * node.scale.x * stageScaleX + 2 * this.padding.x}px`
    this.box.style.height = `${height * node.scale.y * stageScaleY + 2 * this.padding.y}px`
  }
}

export default Transform
