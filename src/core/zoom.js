import { easeInOutQuad } from '@/utils/ease'
// import MouseEvent from './mouse-event'

export default ({ container, airy, app }) => {
  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) &&
      (e.which === 61 ||
      e.which === 107 ||
      e.which === 173 ||
      e.which === 109 ||
      e.which === 187 ||
      e.which === 189)) {
      e.preventDefault()
      if (e.which === 187) {
        // zoom in
        zoom(3, false)
      }
      if (e.which === 189) {
        // zoom out
        zoom(-3, false)
      }
    }
  })

  container.addEventListener('mousewheel', e => {
    if (e.ctrlKey) {
      e.preventDefault()
      zoom(-e.deltaY)
    }
  })

  let zoomAni
  // const mouse = app.renderer.plugins.interaction.mouse

  function zoom (val, focus) {
    // console.log(new MouseEvent(mouse, app.stage), app.stage.scale)
    if (zoomAni) airy.unuse(zoomAni)
    airy.isAnimate = true
    const start = app.stage.scale.x
    const totalFrame = 10
    let frame = 0
    zoomAni = function () {
      frame++
      const scale = easeInOutQuad(frame / totalFrame) * val / 20 + start
      app.stage.scale.x = scale
      app.stage.scale.y = scale
      if (frame >= totalFrame) {
        airy.unuse(zoomAni)
        zoomAni = undefined
      }
    }
    airy.use(zoomAni)
  }
}
