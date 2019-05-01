import * as PIXI from 'pixi.js'
import compose from 'koa-compose'
import FPS from 'yy-fps'
import Store from '@/store'
import Zoom from './zoom'
import Logger from './logger'
import MouseEvent from './mouse-event'
import {
  activePluginSymbol,
  isAnimateSymbol,
  needUpdateSymbol
} from './symbols'

const logger = new Logger('core')
// window.PIXI = undefined

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
    this[activePluginSymbol] = plugins[0]
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
    this.store = new Store()

    // canvas DOM operation
    this.app.view.style.display = 'block'
    container.appendChild(this.app.view)

    this.args = {
      container,
      airy: this,
      app: this.app,
      stage: this.app.stage,
      store: this.store
    }

    this.renderHistory()

    this.zoom = Zoom(this.args)
    this.pointerDownSwitch = false
    this.addEventListener()
    this.middlewares = []
    // this.compose = compose(this.middlewares)

    this.fps = new FPS()

    this[needUpdateSymbol] = true
    this[isAnimateSymbol] = false
    requestAnimationFrame(this.update.bind(this))
  }

  get activePlugin () {
    return this[activePluginSymbol]
  }
  set activePlugin (plugin) {
    // TODO:
    // check whether the parameter is a plugin
    // or change the plugin by the parameter as it's name
    if (plugin !== this[activePluginSymbol]) {
      this[activePluginSymbol].active(this.args)
      this[activePluginSymbol] = plugin
      this[activePluginSymbol].inactive(this.args)
    }
  }

  get isAnimate () {
    return this.middlewares.length > 0
  }

  get needUpdate () {
    return this[needUpdateSymbol]
  }
  set needUpdate (val) {
    this[needUpdateSymbol] = val
  }

  update (timer) {
    this.fps.frame()
    if (this.isAnimate || this.needUpdate) {
      this.needUpdate = false
      // this.compose(this.args)
      compose(this.middlewares)(this.args)
      this.app.render()
    }
    requestAnimationFrame(this.update.bind(this))
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

  addEventListener () {
    this.app.view.oncontextmenu = () => false
    window.addEventListener('mousedown', this.mousedown.bind(this))
    window.addEventListener('mousemove', this.mousemove.bind(this))
    window.addEventListener('mouseup', this.mouseup.bind(this))
    window.addEventListener('paste', this.paste.bind(this))
    // this.unpanzoom = panzoom(document.body, this.zoom)
  }

  mousedown (e) {
    if (e.button !== 0) { // only react to the left mouse button
      return
    }
    if (e.target !== this.app.view) {
      return
    }
    this.pointerDownSwitch = true
    this.needUpdate = this.activePlugin.beginWithMouse(this.args, new MouseEvent(e, this.app.stage))
  }

  mousemove (e) {
    if (!this.pointerDownSwitch) {
      return
    }
    this.needUpdate = this.activePlugin.moveWithMouse(this.args, new MouseEvent(e, this.app.stage))
  }

  mouseup (e) {
    if (!this.pointerDownSwitch) {
      return
    }
    this.pointerDownSwitch = false
    this.needUpdate = this.activePlugin.endWithMouse(this.args, new MouseEvent(e, this.app.stage))
  }

  paste (e) {
    console.log(e)
  }

  destroy () {
    window.removeEventListener('mousedown', this.mousedown)
    window.removeEventListener('mousemove', this.mousemove)
    window.removeEventListener('mouseup', this.mouseup)
    this.app.destroy()
    // TODO: release memory
  }

  use (func) {
    if (this.middlewares.indexOf(func) < 0) {
      this.middlewares.push(func)
    }
  }

  unuse (func) {
    const index = this.middlewares.indexOf(func)
    if (index >= 0) {
      this.middlewares.splice(index, 1)
    }
  }

  ticker (delta) {
    logger.warn('function ticker() has been abandoned')

    const mouse = this.app.renderer.plugins.interaction.mouse

    // left mouse button press
    if (mouse.buttons % 2) {
      if (!this.pointerDownSwitch) {
        this.pointerDownSwitch = true
        this.activePlugin.beginWithMouse(this.args, new MouseEvent(mouse, this.app.stage))
      } else {
        this.activePlugin.moveWithMouse(this.args, new MouseEvent(mouse, this.app.stage))
      }
    } else if (this.pointerDownSwitch) {
      this.pointerDownSwitch = false
      this.activePlugin.endWithMouse(this.args, new MouseEvent(mouse, this.app.stage))
    }
  }
}
