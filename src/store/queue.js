class StoreQueue {
  constructor (store) {
    this.store = store
    this.queue = []
  }

  commit (name, uuid) {
    if (uuid) {
      this.queue.push([name, uuid])
    } else {
      this.queue.push([name])
    }
  }

  process () {
    if (this.queue.length === 0) return false
    let finalState = ['unfocus']
    const history = []
    // merge
    for (const state of this.queue) {
      if (state[0] === 'focus') {
        finalState = ['focus', state[1]]
      } else if (state[0] === 'unfocus') {
        history.push(state)
      }
    }
    // action
    for (const state in history) {
      if (state[1] && finalState[1] && state[1] !== finalState[1]) {
        const node = this.store.findByUuid(state[1])
        if (node) {
          node.focus = false
        }
      }
    }
    if (finalState[0] === 'focus') {
      const node = this.store.findByUuid(finalState[1])
      if (node) {
        if (this.store.focusNode && this.store.focusNode.uuid !== node.uuid) {
          this.store.focusNode.focus = false
        }
        this.store.focusNode = node
        node.focus = true
      }
    } else {
      if (this.store.focusNode) {
        this.store.focusNode.focus = false
        this.store.focusNode = null
      }
    }
    while (this.queue.length) this.queue.pop()
    this.store.airy.needUpdate = true
  }
}

export default StoreQueue
