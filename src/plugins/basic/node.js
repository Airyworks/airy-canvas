import uuidv1 from 'uuid/v1'

class BasicNode {
  constructor (id) {
    this.uuid = uuidv1()
    this.id = id || this.uuid
    this.type = undefined
    this.parent = undefined
  }

  createNode () {}
  mountNode () {}
}

export default BasicNode
