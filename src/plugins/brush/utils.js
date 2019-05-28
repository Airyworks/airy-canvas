export const distance = (p1, p2) => {
  const res = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  return res > 0 ? res : 0.001
}

// if point P is within 180 degrees counterclockwise of vector [pl -> pr]
// it will get a positive value.
export const computeOffset = (pl, pr, p) => {
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
export const offset = (p1, p2, p3, p4, mergerP) => {
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
export const computeSharpLoss = (p1, p2, p3, p4, mergerP) => {
  mergerP = mergerP || {
    x: (p2.x + p3.x) / 2,
    y: (p2.y + p3.y) / 2
  }
  const d1 = Math.abs(distance(p1, p2) - distance(p1, mergerP))
  const d2 = Math.abs(distance(p3, p4) - distance(p4, mergerP))
  return Math.abs(d1 - d2)
}

export const simplify = points => {
  const s = [...points]
  const threshold = 0.6
  let i = 1
  let iteration = true
  for (let i = 1; i < s.length; i++) {
    const prev = s[i - 1]
    const curr = s[i]
    if (curr.x === prev.x && curr.y === prev.y) {
      s.splice(i, 1)
      i--
    }
  }
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

export const genControlPoints = points => {
  const dis = points.map((p, i, points) => {
    let prev = i - 1
    if (prev < 0) {
      return 0
    }
    const prevP = points[prev]
    return distance(p, prevP)
  })
  console.log(dis)
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
