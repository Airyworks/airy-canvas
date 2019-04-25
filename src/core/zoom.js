import { Point } from 'pixi.js'
import { easeInOutQuad } from '@/utils/ease'
import MouseEvent from './mouse-event'

export default ({ container, airy, app }) => {
  window.papp = app
  let mouse

  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) &&
      (e.which === 61 ||
      e.which === 107 ||
      e.which === 173 ||
      e.which === 109 ||
      e.which === 187 ||
      e.which === 189)) {
      e.preventDefault()
      console.log(e)
      if (e.which === 187 || e.which === 107) {
        // zoom in
        zoom(1, false)
      }
      if (e.which === 189 || e.which === 109) {
        // zoom out
        zoom(-1, false)
      }
    }
  })

  container.addEventListener('mousewheel', e => {
    if (e.ctrlKey) {
      e.preventDefault()
      zoom(-e.deltaY / 5, true)
    }
  })

  window.addEventListener('mousemove', e => {
    mouse = e
  })

  let zoomAni, zoomCenter
  // const mouse = app.renderer.plugins.interaction.mouse

  function zoom (val, focus, e) {
    console.log('zoom start')
    if (zoomAni) stop()
    const start = app.stage.scale.x
    const diff = val / 20
    const totalFrame = 10
    let frame = 0
    const mouseEvent = new MouseEvent(mouse, app.stage)
    if (focus) {
      const origin = new Point(mouseEvent.local.x, mouseEvent.local.y)
      app.stage.pivot = origin
      app.stage.position = origin
    } else {
      console.log('position', app.stage.position.x, app.stage.position.y, app.stage.pivot.x, app.stage.pivot.y)
      zoomCenter = new Point(app.view.parentNode.clientWidth / 2,
        app.view.parentNode.clientHeight / 2)
      const center = new Point((-app.stage.position.x + zoomCenter.x) / start,
        (-app.stage.position.y + zoomCenter.y) / start)
      console.log('center', center.x, center.y, app.stage.pivot.x, app.stage.pivot.y)
      const position = app.stage.position.clone()
      const pivot = app.stage.pivot.clone()
      app.stage.pivot = new Point(pivot.x + center.x, pivot.y + center.y)
      //app.stage.position = center //new Point(position.x + center.x, position.y + center.y)
      app.stage.position = new Point(app.stage.pivot.x - pivot.x + position.x,
        app.stage.pivot.y - pivot.y + position.y)
      console.log('start', app.stage.position.x, app.stage.position.y, app.stage.pivot.x, app.stage.pivot.y)
    }
    airy.isAnimate = true
    zoomAni = function () {
      frame++
      const scale = easeInOutQuad(frame / totalFrame) * diff + start
      app.stage.scale.x = scale
      app.stage.scale.y = scale
      if (frame >= totalFrame) {
        stop()
      }
    }
    airy.use(zoomAni)
  }

  function stop () {
    airy.unuse(zoomAni)
    zoomAni = undefined
    console.log('end', app.stage.position.x, app.stage.position.y,
      app.stage.pivot.x, app.stage.pivot.y, zoomCenter.x, zoomCenter.y)
    // console.log('zoomCenter', zoomCenter.x, zoomCenter.y)
    // const mouseEvent = new MouseEvent(mouse, app.stage)
    // const resetOrigin = new Point(mouseEvent.local.x - mouseEvent.global.x * app.stage.scale.x,
    //   mouseEvent.local.y - mouseEvent.global.y * app.stage.scale.y)
    app.stage.pivot = new Point(app.stage.pivot.x - zoomCenter.x / app.stage.scale.x,
      app.stage.pivot.y - zoomCenter.y / app.stage.scale.y)
    app.stage.position = new Point(app.stage.position.x - zoomCenter.x,
      app.stage.position.y - zoomCenter.y)
    console.log('end all', app.stage.position.x, app.stage.position.y,
      app.stage.pivot.x, app.stage.pivot.y)
    // console.log('a', a.x, a.y, app.stage.scale.x, app.stage.scale.y)
  }
}
