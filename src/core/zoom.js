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
      e.which === 189 ||
      e.which === 48)) {
      e.preventDefault()
      if (e.which === 187 || e.which === 107) {
        // zoom in
        zoom(app.stage.scale.x * 4 / 3, false)
      }
      if (e.which === 189 || e.which === 109) {
        // zoom out
        zoom(app.stage.scale.x * 3 / 4, false)
      }
      if (e.which === 48) {
        zoom(1, false)
      }
    }
  })

  container.addEventListener('mousewheel', e => {
    if (e.ctrlKey) {
      e.preventDefault()
      if (e.deltaY > 0) {
        zoom(app.stage.scale.x * 3 / 4, true)
      } else {
        zoom(app.stage.scale.x * 4 / 3, true)
      }
    }
  })

  window.addEventListener('mousemove', e => {
    mouse = e
  })

  let zoomAni, zoomCenter
  // const mouse = app.renderer.plugins.interaction.mouse

  function zoom (val, focus, e) {
    if (zoomAni) stop()
    val = val > 5 ? 5 : val
    const start = app.stage.scale.x
    const diff = val - start
    const totalFrame = 10
    let frame = 0

    const mouseEvent = new MouseEvent(mouse, app.stage)
    if (focus) {
      zoomCenter = new Point(mouseEvent.global.x, mouseEvent.global.y)
    } else {
      zoomCenter = new Point(app.view.parentNode.clientWidth / 2,
        app.view.parentNode.clientHeight / 2)
    }

    const center = new Point((-app.stage.position.x + zoomCenter.x) / start,
      (-app.stage.position.y + zoomCenter.y) / start)
    const position = app.stage.position.clone()
    const pivot = app.stage.pivot.clone()
    app.stage.pivot = new Point(pivot.x + center.x, pivot.y + center.y)
    app.stage.position = new Point((app.stage.pivot.x - pivot.x) * app.stage.scale.x + position.x,
      (app.stage.pivot.y - pivot.y) * app.stage.scale.y + position.y)

    // airy.isAnimate = true
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
    app.stage.pivot = new Point(app.stage.pivot.x - zoomCenter.x / app.stage.scale.x,
      app.stage.pivot.y - zoomCenter.y / app.stage.scale.y)
    app.stage.position = new Point(app.stage.position.x - zoomCenter.x,
      app.stage.position.y - zoomCenter.y)
  }
}
