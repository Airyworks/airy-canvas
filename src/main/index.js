import * as PIXI from 'pixi.js'

// remove PIXI banner from console if necessary
// PIXI.utils.skipHello()

export default class {
  constructor (container, { fluid, width, height }, plugins, history) {
    this.fluid = fluid
    this.plugins = plugins
    this.active = this.plugins[0]
    this.history = history
    if (fluid) {
      this.app = new PIXI.Application({
        autoResize: true,
        backgroundColor: 0xeeeeee,
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

    this.app.view.style.display = 'block'
    container.appendChild(this.app.view)

    this.renderHistory()
    // this.app.ticker.add((delta) => {
    //   console.log('render ticker', delta)
    // })
  }

  resize () {
    const parent = this.app.view.parentNode
    this.app.renderer.resize(parent.clientWidth, parent.clientHeight)
  }

  render (item) {
    for (const plugin of this.plugins) {
      if (item.renderer === plugin.name) {
        this.app.stage.addChild(plugin.render(item))
      }
    }
  }

  renderHistory () {
    for (const item of this.history) {
      this.render(item)
    }
  }
}
