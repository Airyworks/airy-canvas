import { Container } from 'pixi.js'
import Basic from '@/plugins/basic/node'

class Root extends Basic {
  constructor ({ stage, airy }) {
    super(airy)
    this.type = 'root'
    this.node = new Container()
    stage.addChild(this.node)
    this.children = []
  }

  addChild (node) {
    this.children.push(node)
    node.parent = this
    this.node.addChild(node.node)
  }

  removeChild (node) {
    const index = this.children.indexOf(node)
    if (index >= 0) {
      this.children.splice(index, 1)
    }
  }
}

export default Root
