import uuidv1 from 'uuid/v1'
import { Point } from 'pixi.js'
import Transform from './transform-dom'

class BasicNode {
  constructor (airy) {
    this.airy = airy
    this.uuid = uuidv1()
    this.id = this.uuid
    this.type = undefined
    this.parent = undefined
    this.$focus = false
    this.transform = new Transform(airy, this)
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
    console.log('node pointdown', this.type, this.uuid)
    this.airy.store.focus(this.uuid)
    // this.airy.store.focus()
    this.focusEvent(e)
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

  getData () {
    return {}
  }

  fromData (data) {}
}

export default BasicNode
