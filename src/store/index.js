import { uuidDictSymbol, idDictSymbol } from './symbols'
import Root from './root'
import StoreQueue from './queue'

class Store {
  constructor ({ stage, airy }) {
    this.airy = airy
    this.root = new Root({ stage, airy })
    this[uuidDictSymbol] = {}
    this[idDictSymbol] = {}
    this.focusNode = undefined
    this.queue = new StoreQueue(this)
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
    // console.log(node)
    if (node) {
      this.queue.commit('focus', node.uuid)
      // if (this.focusNode && this.focusNode.uuid !== node.uuid) {
      //   console.log('trigger unfocus before set')
      //   this.unfocus()
      // }
      // this.focusNode = node
      // console.log('focus node after set', this.focusNode)
    }
  }

  showFocus () {
    this.queue.process()
    // if (this.focusNode) {
    //   this.focusNode.focus = true
    // }
  }

  unfocus () {
    // console.log('store unfocus event', new Error().stack)
    if (this.focusNode) {
      // this.focusNode.focus = false
      // this.focusNode = undefined
      this.queue.commit('unfocus', this.focusNode.uuid)
    }
    // this.airy.needUpdate = true
  }
}

export default Store
