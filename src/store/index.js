import { uuidDictSymbol, idDictSymbol } from './symbols'
import Root from './root'
import StoreQueue from './queue'

class Store {
  constructor ({ stage, airy }) {
    this.airy = airy
    this.stage = stage
    this.root = new Root({ stage, airy })
    this[uuidDictSymbol] = { 'root': this.root }
    this[idDictSymbol] = { 'root': this.root }
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

  action (el, action, payload) {
    if (payload) {
      el[action](payload)
    } else {
      el[action]()
    }
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

  commit (uuid) {
    const node = this.findByUuid(uuid)
    if (node) {
      console.log(node.getData(), node)
    }
  }

  renderHistory (history) {
    for (const item of history) {
      this.createNode(item)
    }
  }

  createNode (data) {
    const { airy, stage } = this
    const pluginName = data.plugin
    const plugin = this.airy.plugins.find(i => i.name === pluginName)
    if (plugin) {
      const node = new plugin.Node({ airy, stage }, plugin.setting)
      node.fromData(data.data)
      const parent = this.findByUuid(data.parent)
      if (parent) {
        parent.addChild(node)
        node.mountNode()
        this[uuidDictSymbol][node.uuid] = node
        this[uuidDictSymbol][node.id] = node
      } else {
        // error, parent nou found
        throw Error(`parent ${data.parent} not found`)
      }
    } else {
      // error, plugin not found
      throw Error(`plugin ${pluginName} not found`)
    }
  }

  createNodeOld (data) {
    const { airy, stage } = this
    const reg = /^<([0-9a-zA-Z-]*)>/
    const pluginPrefix = data.data.match(reg)
    if (pluginPrefix) {
      const pluginName = pluginPrefix[1]
      const plugin = this.airy.plugins.find(i => i.name === pluginName)
      if (plugin) {
        const node = new plugin.Node({ airy, stage }, plugin.setting)
        const contentReg = /^<[0-9a-zA-Z-]*>([\s\S]*)$/
        node.fromData(data.data.match(contentReg)[1])
        const parent = this.findByUuid(data.parent)
        if (parent) {
          parent.addChild(node)
          node.mountNode()
          this[uuidDictSymbol][node.uuid] = node
          this[uuidDictSymbol][node.id] = node
        } else {
          // error, parent nou found
          throw Error(`parent ${data.parent} not found`)
        }
      } else {
        // error, plugin not found
        throw Error(`plugin ${pluginName} not found`)
      }
    } else {
      // error, invalid input data
      throw Error(`invalid input data: ${data.data}`)
    }
  }
}

export default Store
