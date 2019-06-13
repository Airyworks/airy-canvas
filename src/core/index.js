import * as PIXI from 'pixi.js'
import compose from 'koa-compose'
import FPS from 'yy-fps'
import jss from 'jss'
import camelCase from 'jss-plugin-camel-case'
import Store from '@/store'
import Zoom from './zoom'
import Logger from './logger'
import MouseEvent from './mouse-event'
import {
  activePluginSymbol,
  isAnimateSymbol,
  needUpdateSymbol
} from './symbols'

jss.use(camelCase())

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
  constructor (component, container, { fluid, width, height }, plugins, history) {
    this.component = component
    this.container = container
    this.jss = jss
    this.fluid = fluid
    this.plugins = plugins
    this[activePluginSymbol] = plugins[0]
    this.history = history || []
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
    this.app.renderer.plugins.interaction.autoPreventDefault = true

    this.store = new Store({
      airy: this,
      app: this.app,
      stage: this.app.stage
    })
    window.store = this.store

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
    this.enableEvent = false
    this.listener = {
      mousedown: this.mousedown.bind(this),
      mousemove: this.mousemove.bind(this),
      mouseup: this.mouseup.bind(this),
      click: this.click.bind(this)
    }
    this.initEventListener()
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
      if (plugin.name === 'basic-select') {
        // remove event handler
        this.removeEventListener()
      } else {
        // add event handler
        this.addEventListener()
      }
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
    this.needUpdate = true
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

  updateNode (node) {
    this.store.updateNode(node)
  }

  renderHistory () {
    this.store.renderHistory(this.history)
  }

  updateHistory (val) {
    this.history = val
    this.store.updateHistory(this.history)
  }

  initEventListener () {
    this.app.view.oncontextmenu = () => false
    this.container.addEventListener('paste', this.paste.bind(this))
    // can trigger dom focus in click
    this.container.addEventListener('click', this.listener.click)
    this.addEventListener()
  }

  addEventListener () {
    if (!this.enableEvent) {
      this.enableEvent = true
      this.container.addEventListener('mousedown', this.listener.mousedown)
      this.container.addEventListener('mousemove', this.listener.mousemove)
      this.container.addEventListener('mouseup', this.listener.mouseup)
    }
  }

  removeEventListener () {
    if (this.enableEvent) {
      this.enableEvent = false
      this.container.removeEventListener('mousedown', this.listener.mousedown)
      this.container.removeEventListener('mousemove', this.listener.mousemove)
      this.container.removeEventListener('mouseup', this.listener.mouseup)
      // this.container.removeEventListener('click', this.listener.click)
    }
  }

  mousedown (e) {
    console.log('mousedown')
    const plugin = this.activePlugin
    if (e.button !== 0) { // only react to the left mouse button
      return
    }
    if (e.target !== this.app.view) {
      return
    }
    this.pointerDownSwitch = true
    if (plugin.name !== 'basic-select') {
      this.store.unfocus()
      const needUpdate = plugin.beginWithMouse(this.args, new MouseEvent(e, this.app.stage))
      this.needUpdate = this.needUpdate || needUpdate
    }
  }

  mousemove (e) {
    const plugin = this.activePlugin
    if (!this.pointerDownSwitch) {
      return
    }
    if (plugin.name !== 'basic-select') {
      const needUpdate = plugin.moveWithMouse(this.args, new MouseEvent(e, this.app.stage))
      this.needUpdate = this.needUpdate || needUpdate
    }
    // const needUpdate = plugin.moveWithMouse(this.args, new MouseEvent(e, this.app.stage))
    // this.needUpdate = this.needUpdate || needUpdate
  }

  mouseup (e) {
    console.log('mouseup')
    const plugin = this.activePlugin
    if (!this.pointerDownSwitch) {
      return
    }
    this.pointerDownSwitch = false
    if (plugin.name !== 'basic-select') {
      this.store.unfocus()
      const needUpdate = plugin.endWithMouse(this.args, new MouseEvent(e, this.app.stage))
      this.needUpdate = this.needUpdate || needUpdate
      // this.switchPlugin('basic-select')
    }
  }

  click (e) {
    // if (this.store.focusNode) {
    //   console.log('click focusNode')
    //   this.store.focus(this.store.focusNode.uuid)
    // }
    this.store.showFocus()
  }

  paste (e) {
    console.log(e)
  }

  destroy () {
    this.removeEventListener()
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

  switchPlugin (name) {
    this.component.activePlugin(name)
  }
}
