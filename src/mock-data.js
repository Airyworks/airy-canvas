export default [
  {
    renderer: 'basic-line',
    ts: 1555784279327,
    data: {
      color: 0x1099bb,
      points: [[10, 10], [200, 400]]
    }
  }
]

export const generate = () => {
  return {
    renderer: 'basic-line',
    ts: new Date().getTime(),
    data: {
      color: 0x1099bb,
      points: [
        [Math.random() * 100, Math.random() * 100],
        [400 + Math.random() * 100, 300 + Math.random() * 100]
      ]
    }
  }
}
