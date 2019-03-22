'use strict'

import Brush from './Brush'
import Cursor from '@/model/Cursor'

const toFixed = number => {
  return number.toFixed(2).replace(/\.?0+$/, '')
}

const distance = (p1, p2) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

// if point P is within 180 degrees counterclockwise of vector [pl -> pr]
// it will get a positive value.
const computeOffset = (pl, pr, p) => {
  const base = distance(pl, pr)
  if (base < 0.1) {
    return distance(pl, p)
  }
  const v1 = [pr.x - pl.x, pr.y - pl.y]
  const v2 = [p.x - pl.x, p.y - pl.y]
  const area = v1[0] * v2[1] - v1[1] * v2[0]
  const offset = area / base
  return offset
}
const offset = (p1, p2, p3, p4, mergerP) => {
  mergerP = mergerP || {
    x: (p2.x + p3.x) / 2,
    y: (p2.y + p3.y) / 2
  }
  const d1 = computeOffset(p1, mergerP, p2)
  const d2 = computeOffset(mergerP, p4, p3)
  return Math.abs(d1 + d2)
}
// calculate a coefficient to indicate the distortion
// at the sharp corner after merging points
const computeSharpLoss = (p1, p2, p3, p4, mergerP) => {
  mergerP = mergerP || {
    x: (p2.x + p3.x) / 2,
    y: (p2.y + p3.y) / 2
  }
  const d1 = Math.abs(distance(p1, p2) - distance(p1, mergerP))
  const d2 = Math.abs(distance(p3, p4) - distance(p4, mergerP))
  return Math.abs(d1 - d2)
}

const simplify = points => {
  const s = [...points]
  const threshold = 0.6
  let i = 1
  let iteration = true
  while (iteration) {
    i = 1
    iteration = false
    while (i < s.length - 3) {
      const leftP = s[i - 1]
      const rightP = s[i + 2]
      const mergerP = {
        x: (s[i].x + s[i + 1].x) / 2,
        y: (s[i].y + s[i + 1].y) / 2
      }
      const d = offset(leftP, s[i], s[i + 1], rightP, mergerP)
      if (d < threshold) {
        const sharpLoss = computeSharpLoss(leftP, s[i], s[i + 1], rightP, mergerP)
        if (sharpLoss < threshold / 2) {
          iteration = true
          s[i] = mergerP
          s.splice(i + 1, 1)
        }
      }
      i++
    }
  }
  if (s.length <= 2) {
    return s
  }
  if (distance(s[i + 1], s[i + 2]) < threshold) {
    s.pop()
  }
  if (distance(s[0], s[1]) < threshold) {
    s.unshift()
  }
  return s
}

const genControlPoints = points => {
  const dis = points.map((p, i, points) => {
    let prev = i - 1
    if (prev < 0) {
      return 0
    }
    const prevP = points[prev]
    return distance(p, prevP)
  })
  let p1 = points[0]
  const controlPoints = points.map((p, i, points) => {
    let next = i + 1
    if (i === 0 || next >= points.length) {
      return {
        left: p,
        right: p
      }
    }
    const p2 = points[next]
    const v1 = [(p1.x - p.x) / dis[i], (p1.y - p.y) / dis[i]]
    const v2 = [(p2.x - p.x) / dis[next], (p2.y - p.y) / dis[next]]
    const tangent = [v2[0] - v1[0], v2[1] - v1[1]]
    const min = Math.min(dis[i], dis[next])
    const left = {
      x: p.x - tangent[0] * min * 0.16,
      y: p.y - tangent[1] * min * 0.16
    }
    const right = {
      x: p.x + tangent[0] * min * 0.16,
      y: p.y + tangent[1] * min * 0.16
    }
    p1 = p
    return { left, right }
  })

  return controlPoints
}

export default class Pen extends Brush {
  constructor (recorder) {
    super(recorder, 'Pen')

    this.color = '#ff0000'
    this.penRadius = 5
    this.alpha = 0.3

    this._active = false
    this.needUpdate = false

    this.cursor = new Cursor(require('@/assets/cursor/pen.png'), 5, 27)
    this.cursorActive = new Cursor(require('@/assets/cursor/pen_active.png'), 5, 27)

    this._init()
  }

  get paletteConfig () {
    return [
      {
        name: 'color',
        type: 'Color'
      },
      {
        name: 'size',
        type: 'Number',
        option: {
          min: 1,
          max: 20,
          step: 0.1
        }
      },
      {
        name: 'alpha',
        type: 'Number',
        option: {
          min: 0,
          max: 1
        }
      }
    ]
  }

  stringify () {
    let output = `<PEN>${this.color};${this.penRadius.toFixed(2)};${this.alpha.toFixed(2)};`
    output += toFixed(this.path[0].x) + ',' + toFixed(this.path[0].y)
    this.path.reduce((last, point) => {
      output += `,${toFixed(point.x - last.x)},${toFixed(point.y - last.y)}`
      return point
    }, this.path[0])
    return output
  }

  beginAtPos (x, y) {
    this._init()
    this._active = true
    this.needUpdate = true
    this._updateBoxByNewPoint(x, y)
    this.path = [{ x, y }]
  }

  moveAtPos (x, y) {
    if (!this._active) {
      return
    }
    this.needUpdate = true
    this._updateBoxByNewPoint(x, y)
    this.path.push({ x, y })
  }

  endAtPos (x, y) {
    if (!this._active) {
      return false
    }
    this._active = false
    this.path = simplify(this.path)
    // console.log(this.stringify())
    this.ctrlPoints = genControlPoints(this.path)
    // console.log(this.path)
    // console.log(this.ctrlPoints)
    this.needUpdate = true
    return true
  }

  updateWithActiveLayer (layer) {
    this.needUpdate = false
    const ctx = this.recorder.activeCtx
    if (!(ctx instanceof CanvasRenderingContext2D)) {
      return
    }
    if (this.path.length === 0) {
      return
    }
    const [x, y, w, h] = this._getBoxInfo()
    ctx.clearRect(x, y, w, h)
    ctx.beginPath()
    ctx.moveTo(this.path[0].x, this.path[0].y)
    if (this.path.length === 1) {
      ctx.lineTo(this.path[0].x, this.path[0].y + 0.001)
    } else if (this.ctrlPoints.length) {
      for (let i = 1; i < this.path.length; i++) {
        const pos = this.path[i]
        const cp1 = this.ctrlPoints[i - 1].right
        const cp2 = this.ctrlPoints[i].left
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, pos.x, pos.y)
      }
    } else {
      for (let i = 1; i < this.path.length; i++) {
        const pos = this.path[i]
        ctx.lineTo(pos.x, pos.y)
      }
    }
    ctx.globalAlpha = this.alpha
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.penRadius * 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    // ctx.save()
    // ctx.globalAlpha = 1
    // ctx.fillStyle = '#000'
    // this.path.forEach(point => {
    //   ctx.fillRect(point.x - 2, point.y - 2, 4, 4)
    // })
    // ctx.globalAlpha = 0.3
    // ctx.fillStyle = '#f00'
    // this.ctrlPoints.forEach(point => {
    //   ctx.fillRect(point.right.x - 2, point.right.y - 2, 4, 4)
    //   ctx.fillRect(point.left.x - 2, point.left.y - 2, 4, 4)
    // })
    // ctx.restore()
    layer.layerImgData = ctx.getImageData(x, y, w, h)
    layer.x = x
    layer.y = y
    layer.w = w
    layer.h = h
    if (this.ctrlPoints.length) {
      layer.data = this.stringify()
    }
  }

  _init () {
    this.path = []
    this.ctrlPoints = []
    this.boxLeft = Infinity
    this.boxRight = -Infinity
    this.boxTop = Infinity
    this.boxBottom = -Infinity
  }

  _updateBoxByNewPoint (x, y) {
    if (x < this.boxLeft) {
      this.boxLeft = Math.max(x, 0)
    }
    if (x > this.boxRight) {
      this.boxRight = x
    }
    if (y < this.boxTop) {
      this.boxTop = Math.max(y, 0)
    }
    if (y > this.boxBottom) {
      this.boxBottom = y
    }
  }

  _getBoxInfo () {
    const r = this.penRadius + 6
    return [
      this.boxLeft - r,
      this.boxTop - r,
      this.boxRight - this.boxLeft + 2 * r,
      this.boxBottom - this.boxTop + 2 * r
    ] // [x, y, w, h]
  }
}
