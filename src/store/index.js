import { uuidDictSymbol, idDictSymbol } from './symbols'
import Root from './root'

class Store {
  constructor ({ stage, airy }) {
    this.root = new Root({ stage, airy })
    this[uuidDictSymbol] = {}
    this[idDictSymbol] = {}
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
    if (payload) {
      el[action](payload)
    } else {
      el[action]()
    }
  }

  focus (uuid) {
    const node = this.findByUuid(uuid)
    if (node) {
      node.focus = true
    }
  }
}

export default Store
