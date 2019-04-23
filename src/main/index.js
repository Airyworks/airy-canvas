import * as PIXI from 'pixi.js'
import FPS from 'yy-fps'
import PixiViewport from 'pixi-viewport'
// import Zoom from './zoom'
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
    this.fps = new FPS({ side: 'bottom-left' })
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

    // canvas DOM operation
    this.app.view.style.display = 'block'
    container.appendChild(this.app.view)

    this.viewport = new PixiViewport({
      passiveWheel: false,
      interaction: this.app.renderer.plugins.interaction // the interaction module is important for wheel() to work properly when renderer.view is placed or scaled
    })
    this.app.stage.addChild(this.viewport)
    this.viewport
      .drag()
      .pinch()
      .wheel()
      .decelerate()

    this.args = {
      app: this.app,
      viewport: this.viewport
    }

    this.renderHistory()

    this.pointerDownSwitch = false
    // this.app.ticker.add((delta) => {
    //   this.ticker(delta)
    // })
    this.addEventListener()

    this.lastUpdate = new Date().getTime()
    this.interval = 1000 / (60 * 2)

    this.needUpdate = true
    requestAnimationFrame(timer => {
      this.update(timer)
    })
    PIXI.ticker.shared.add(() => {
      this.fps.frame()
    })
  }

  get activePlugin () {
    return this._activePlugin
  }
  set activePlugin (plugin) {
    // TODO:
    // check whether the parameter is a plugin
    // or change the plugin by the parameter as it's name
    if (plugin !== this._activePlugin) {
      this._activePlugin.active(this.args)
      this._activePlugin = plugin
      this._activePlugin.inactive(this.args)
      // this._activePlugin.call(this._activePlugin.inactive, this.args)
    }
  }

  update (timer) {
    // if (this.needUpdate) {
    //   this.needUpdate = false
    //   this.app.render()
    // }
    if (new Date().getTime() >= this.lastUpdate + this.interval) {
      this.needUpdate = false
      this.lastUpdate = new Date().getTime()
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
        // this.app.stage.addChild()
        plugin.render({
          app: this.app,
          viewport: this.viewport
        }, item)
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
        this.activePlugin.beginWithMouse({
          app: this.app,
          viewport: this.viewport
        }, new MouseEvent(mouse, this.app.stage))
      } else {
        this.activePlugin.moveWithMouse({
          app: this.app,
          viewport: this.viewport
        }, new MouseEvent(mouse, this.app.stage))
      }
    } else if (this.pointerDownSwitch) {
      this.pointerDownSwitch = false
      this.activePlugin.endWithMouse({
        app: this.app,
        viewport: this.viewport
      }, new MouseEvent(mouse, this.app.stage))
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
      this.needUpdate = this.activePlugin.beginWithMouse({
        app: this.app,
        viewport: this.viewport
      }, new MouseEvent(e, this.app.stage))
    })
    window.addEventListener('mousemove', e => {
      if (!this.pointerDownSwitch) {
        return
      }
      this.needUpdate = this.activePlugin.moveWithMouse({
        app: this.app,
        viewport: this.viewport
      }, new MouseEvent(e, this.app.stage))
    })
    window.addEventListener('mouseup', e => {
      if (!this.pointerDownSwitch) {
        return
      }
      this.pointerDownSwitch = false
      this.needUpdate = this.activePlugin.endWithMouse({
        app: this.app,
        viewport: this.viewport
      }, new MouseEvent(e, this.app.stage))
    })
  }

  destroy () {
    this.app.destroy()
    // TODO: release memory
  }
}
