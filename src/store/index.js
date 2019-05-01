import { uuidDictSymbol, idDictSymbol } from './symbols'
import Root from './root'

class Store {
  constructor () {
    this.root = new Root()
    this[uuidDictSymbol] = {}
    this[idDictSymbol] = {}
  }

  addNode (node) {
    this.root.addNode(node)
    this[uuidDictSymbol][node.uuid] = node
    this[uuidDictSymbol][node.id] = node
  }

  findByUuid (uuid) {
    return this[uuidDictSymbol][uuid]
  }

  findById (id) {
    return this[idDictSymbol][id]
  }
}

export default Store
