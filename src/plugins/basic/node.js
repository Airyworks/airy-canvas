import uuidv1 from 'uuid/v1'
import { Point } from 'pixi.js'
import Transform from './transform-dom'

class BasicNode {
  constructor (airy, meta) {
    this.airy = airy
    this.store = airy.store
    this.uuid = meta ? meta.uuid : uuidv1()
    this.id = this.uuid
    this.ts = meta ? meta.ts : new Date().getTime()
    this.type = undefined
    this.parent = undefined
    this.$focus = false
    this.transform = new Transform(airy, this)
    this.moveInClick = 0
    this.listener = {
      moveEvent: this.moveEvent.bind(this),
      upEvent: this.upEvent.bind(this)
    }
  }

  get focus () {
    return this.$focus
  }

  set focus (val) {
    if (!(this.$focus === val)) {
      console.log(this.$focus, val, 'this.focusEvent()')
      this.$focus = val
      if (val) {
        this.transform.show()
        this.focusEvent()
      } else {
        this.transform.hide()
        this.unfocusEvent()
        this.unfocus()
      }
    }
  }

  createNode () {}
  mountNode () {
    if (this.node) {
      this.node.interactive = true
      this.node.on('pointerdown', this.clickEvent.bind(this))
    }
  }

  clickEvent (e) {
    e.stopPropagation()
    if (this.airy.activePlugin.name === 'basic-select') {
      this.moveInClick = 0
      this.transform.boxMouseDown(e.data)
      window.addEventListener('mousemove', this.listener.moveEvent)
      window.addEventListener('mouseup', this.listener.upEvent)
    }
    // this.airy.store.focus()
    this.focusEvent(e)
  }

  moveEvent (e) {
    e.stopPropagation()
    this.moveInClick++
    this.transform.boxMouseMove(e)
  }

  upEvent (e) {
    e.stopPropagation()
    this.transform.boxMouseUp(e)
    window.removeEventListener('mousemove', this.listener.moveEvent)
    window.removeEventListener('mouseup', this.listener.upEvent)
    if (this.moveInClick <= 1) {
      this.airy.store.focus(this.uuid)
    }
  }

  unfocus () {}
  focusEvent (e) {}
  unfocusEvent () {}

  updateLocalPositoin (val) {
    this.node.position = val
    this.airy.needUpdate = true
  }

  getLocalPosition () {
    return new Point(this.node.position.x, this.node.position.y)
  }
  getGlobalPosition () {
    let { x, y } = this.node.hitArea || { x: 0, y: 0 }
    const { x: xPos, y: yPos } = this.node.position
    x += xPos
    y += yPos
    const stage = this.airy.app.stage
    return new Point(
      (x - stage.pivot.x) * stage.scale.x + stage.position.x,
      (y - stage.pivot.y) * stage.scale.y + stage.position.y
    )
  }

  stringify () {
    return ''
  }

  getInfo () {
    return {
      uuid: this.uuid,
      ts: this.ts,
      data: this.getData(),
      plugin: this.type,
      parent: this.parent.uuid
    }
  }

  getData () {
    return {}
  }

  fromData (data) {}

  updateData (data) {}

  commit () {
    if (this.store) {
      this.store.commit(this.uuid)
    }
  }
}

export default BasicNode
