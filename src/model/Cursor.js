'use strtic'

export default class Cursor {
  constructor (url, x, y) {
    this.url = url
    this.x = x || 0
    this.y = y || 0
  }

  toString () {
    return `url(${this.url}) ${this.x} ${this.y}`
  }
}
