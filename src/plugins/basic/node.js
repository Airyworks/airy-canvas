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
    this.$focus = val
    if (val) {
      this.transform.show()
    } else {
      this.transform.hide()
      this.unfocus()
    }
  }

  updatePositoin (val) {
    console.log('updatePositoin basic')
    this.node.position = val
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
    this.airy.store.focus(this.uuid)
    this.onclick(e)
  }

  onclick (e) {}
  unfocus () {}

  getGlobalLocation () {
    const { x, y } = this.node.hitArea || this.node
    const stage = this.airy.app.stage
    console.log(this.node, this.node.x, stage.pivot.x, stage.scale.x, stage.position.x)
    return new Point(
      (x - stage.pivot.x) * stage.scale.x + stage.position.x,
      (y - stage.pivot.y) * stage.scale.y + stage.position.y
    )
  }
}

export default BasicNode
