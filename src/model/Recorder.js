'use strict'

class Layer {
  constructor (id) {
    this.id = id
    this.layerImgData = null
    this.w = 0
    this.h = 0
    this.x = 0
    this.y = 0
    this.data = ''
  }
}

export default class Recorder {
  constructor (canvas) {
    this.canvas = canvas
    this.width = canvas.width
    this.height = canvas.height

    this.needUpdate = true

    this.activeIndex = 0
    this.history = []
    this.tree = []
    this.furthestImgData = null
    this.nearestImgData = null

    this.scale = 1
    this.offsetX = 0
    this.offsetY = 0

    const cacheCanvas = document.createElement('canvas')
    cacheCanvas.width = this.width
    cacheCanvas.height = this.height
    this.cacheCtx = cacheCanvas.getContext('2d')

    const activeCanvas = document.createElement('canvas')
    activeCanvas.width = this.width
    activeCanvas.height = this.height
    this.activeCtx = activeCanvas.getContext('2d')

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = this.width
    tempCanvas.height = this.height
    this.tempCanvas = tempCanvas
    this.tempCtx = tempCanvas.getContext('2d')

    const div = document.createElement('div')
    div.className = 'airy-canvas-test'
    div.append(tempCanvas)
    div.append(activeCanvas)
    div.append(cacheCanvas)
    // document.body.append(div)

    this.activeLayer = new Layer(this.activeIndex)
  }

  solidify () {
    this.tree.push(this.activeLayer.data)
    this.history.push(this.activeLayer)
    this.render(this.cacheCtx)
    this.nearestImgData = this.cacheCtx.getImageData(0, 0, this.width, this.height)
    this.activeLayer = new Layer(++this.activeIndex)
  }

  revoke () {
    if (this.activeIndex === 0) {
      return
    }
    const ctx = this.cacheCtx
    this.history.pop()
    this.tree.pop()
    ctx.clearRect(0, 0, this.width, this.height)
    if (this.furthestImgData) {
      ctx.putImageData(this.furthestImgData, 0, 0)
    }
    this.history.forEach(layer => {
      this.tempCtx.clearRect(0, 0, this.width, this.height)
      this.tempCtx.putImageData(layer.layerImgData, layer.x, layer.y)
      ctx.drawImage(this.tempCanvas, 0, 0)
    })
    this.nearestImgData = ctx.getImageData(0, 0, this.width, this.height)
    this.activeLayer = new Layer(this.activeLayer.id)
  }

  render (ctx) {
    if (!(ctx instanceof CanvasRenderingContext2D)) {
      return
    }
    ctx.save()
    ctx.scale(this.scale, this.scale)
    ctx.translate(this.offsetX, this.offsetY)
    if (this.nearestImgData) {
      ctx.putImageData(this.nearestImgData, 0, 0)
    } else {
      ctx.save()
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, this.width, this.height)
      ctx.restore()
    }
    const al = this.activeLayer
    if (al.layerImgData) {
      this.tempCtx.clearRect(0, 0, this.width, this.height)
      this.tempCtx.putImageData(al.layerImgData, al.x, al.y)
      ctx.drawImage(this.tempCanvas, 0, 0)
    }
    ctx.restore()
  }
}
