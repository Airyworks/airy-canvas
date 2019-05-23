import { uuidDictSymbol, idDictSymbol } from './symbols'
import Root from './root'

class Store {
  constructor ({ stage, airy }) {
    this.airy = airy
    this.root = new Root({ stage, airy })
    this[uuidDictSymbol] = {}
    this[idDictSymbol] = {}
    this.focusNode = undefined
  }

  addNode (node) {
    this.root.addChild(node)
    node.mountNode()
    this[uuidDictSymbol][node.uuid] = node
    this[uuidDictSymbol][node.id] = node
  }

  findByUuid (uuid) {
    return this[uuidDictSymbol][uuid]
  }

  findById (id) {
    return this[idDictSymbol][id]
  }

  commit (el, action, payload) {
    console.log(el, action)
    if (payload) {
      el[action](payload)
    } else {
      el[action]()
    }
    console.log('commit finish')
  }

  focus (uuid) {
    const node = this.findByUuid(uuid)
    if (node) {
      this.unfocus()
      node.focus = true
      this.focusNode = node
    }
  }

  unfocus () {
    if (this.focusNode) {
      this.focusNode.focus = false
      this.focusNode = undefined
    }
    this.airy.needUpdate = true
  }
}

export default Store
