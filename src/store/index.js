import { uuidDictSymbol, idDictSymbol } from './symbols'
import Root from './root'

class Store {
  constructor ({ app, stage }) {
    this.root = new Root(stage)
    this[uuidDictSymbol] = {}
    this[idDictSymbol] = {}
  }

  addNode (node) {
    this.root.addChild(node)
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
}

export default Store
