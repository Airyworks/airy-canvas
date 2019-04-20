import * as PIXI from 'pixi.js'

// remove PIXI banner from console if necessary
// PIXI.utils.skipHello()

export default class {
  constructor (container, { fluid, width, height }) {
    this.fluid = fluid
    if (fluid) {
      this.app = new PIXI.Application({
        autoResize: true,
        backgroundColor: 0x1099bb,
        resolution: window.devicePixelRatio || 1
      })
    } else {
      this.app = new PIXI.Application({
        width,
        height,
        backgroundColor: 0x1099bb,
        resolution: window.devicePixelRatio || 1
      })
    }
    container.appendChild(this.app.view)
  }

  resize () {
    const parent = this.app.view.parentNode
    this.app.renderer.resize(parent.clientWidth, parent.clientHeight)
  }
}
