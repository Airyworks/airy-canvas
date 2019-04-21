import * as PIXI from 'pixi.js'

// remove PIXI banner from console if necessary
// PIXI.utils.skipHello()

export default class {
  constructor (container, { fluid, width, height }, plugins, history) {
    this.fluid = fluid
    this.plugins = plugins
    this._activePlugin = plugins.filter(plugin => /brush/.test(plugin.name))[0] // TODO: find another elegant way
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

    let pointerDownSwitch = false
    this.app.ticker.add(() => {
      // TODO: package following method, remove from constructors
      const mouse = this.app.renderer.plugins.interaction.mouse

      // left mouse button press
      if (mouse.buttons % 2) {
        if (!pointerDownSwitch) {
          pointerDownSwitch = true
          this.activePlugin.beginWithMouse(mouse, this.app.stage)
        } else {
          this.activePlugin.moveWithMouse(mouse, this.app.stage)
        }
      } else if (pointerDownSwitch) {
        pointerDownSwitch = false
        this.activePlugin.endWithMouse(mouse, this.app.stage)
      }
    })
  }

  get activePlugin () {
    return this._activePlugin
  }
  set activePlugin (plugin) {
    // TODO:
    // check whether the parameter is a plugin
    // or change the plugin by the parameter as it's name
    this._activePlugin = plugin
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
