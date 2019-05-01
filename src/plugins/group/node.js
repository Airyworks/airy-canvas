import uuidv1 from 'uuid/v1'

class BasicNode {
  constructor (id) {
    this.uuid = uuidv1()
    this.id = id || this.uuid
    this.type = 'basic-group'
    this.children = []
    this.parent = undefined
  }

  appendChild (node) {
    this.children.push(node)
    node.parent = this
  }

  removeChild (node) {
    const index = this.children.indexOf(node)
    if (index >= 0) {
      this.children.splice(index, 1)
    }
  }

  createNode () {}

  mountNode () {}
}

export default BasicNode
