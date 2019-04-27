class BasicNode {
  constructor () {
    this.children = []
    this.parent = undefined
  }

  appendChild (node) {
    this.children.push(node)
  }

  removeChild (node) {
    const index = this.children.indexOf(node)
    if (index >= 0) {
      this.children.splice(index, 1)
    }
  }
}

export default BasicNode
