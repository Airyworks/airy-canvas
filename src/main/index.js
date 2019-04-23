import * as PIXI from 'pixi.js'
import MouseEvent from './mouse-event'

// remove PIXI banner from console if necessary
// PIXI.utils.skipHello()

const withPIXIDefaultOptions = options => Object.assign({
  autoStart: false,
  antialias: true,
  resolution: window.devicePixelRatio || 1
}, options)

export default class {
  constructor (container, { fluid, width, height }, plugins, history) {
    this.fluid = fluid
    this.plugins = plugins
    this._activePlugin = plugins[0]
    this.history = history
    if (fluid) {
      this.app = new PIXI.Application(withPIXIDefaultOptions({
        autoResize: true,
        backgroundColor: 0xeeeeee
      }))
    } else {
      this.app = new PIXI.Application(withPIXIDefaultOptions({
        width,
        height,
        backgroundColor: 0x1099bb
      }))
    }

    this.app.view.style.display = 'block'
    container.appendChild(this.app.view)

    this.renderHistory()

    this.pointerDownSwitch = false
    // this.app.ticker.add((delta) => {
    //   this.ticker(delta)
    // })
    this.addEventListener()

    this.needUpdate = true
    requestAnimationFrame(timer => {
      this.update(timer)
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

  update (timer) {
    if (this.needUpdate) {
      this.needUpdate = false
      this.app.render()
    }
    requestAnimationFrame(timer => {
      this.update(timer)
    })
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

  ticker (delta) {
    console.warn('function ticker() has been abandoned')

    const mouse = this.app.renderer.plugins.interaction.mouse

    // left mouse button press
    if (mouse.buttons % 2) {
      if (!this.pointerDownSwitch) {
        this.pointerDownSwitch = true
        this.activePlugin.beginWithMouse(this.app, new MouseEvent(mouse, this.app.stage))
      } else {
        this.activePlugin.moveWithMouse(this.app, new MouseEvent(mouse, this.app.stage))
      }
    } else if (this.pointerDownSwitch) {
      this.pointerDownSwitch = false
      this.activePlugin.endWithMouse(this.app, new MouseEvent(mouse, this.app.stage))
    }
  }

  addEventListener () {
    this.app.view.oncontextmenu = () => false
    window.addEventListener('mousedown', e => {
      if (e.button !== 0) { // only react to the left mouse button
        return
      }
      if (e.target !== this.app.view) {
        return
      }
      this.pointerDownSwitch = true
      this.needUpdate = this.activePlugin.beginWithMouse(
        this.app,
        new MouseEvent(e, this.app.stage)
      )
    })
    window.addEventListener('mousemove', e => {
      if (!this.pointerDownSwitch) {
        return
      }
      this.needUpdate = this.activePlugin.moveWithMouse(
        this.app,
        new MouseEvent(e, this.app.stage)
      )
    })
    window.addEventListener('mouseup', e => {
      if (!this.pointerDownSwitch) {
        return
      }
      this.pointerDownSwitch = false
      this.needUpdate = this.activePlugin.endWithMouse(
        this.app,
        new MouseEvent(e, this.app.stage)
      )
    })
  }

  destroy () {
    this.app.destroy()
    // TODO: release memory
  }
}
