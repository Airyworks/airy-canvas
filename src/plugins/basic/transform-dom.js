const padding = {
  x: 10, y: 5
}

class Transform {
  constructor (airy, component) {
    this.airy = airy
    this.component = component
    this.status = false
    this.box = document.createElement('div')
    this.lt = document.createElement('div')
    this.t = document.createElement('div')
    this.rt = document.createElement('div')
    this.lm = document.createElement('div')
    this.rm = document.createElement('div')
    this.lb = document.createElement('div')
    this.b = document.createElement('div')
    this.rb = document.createElement('div')
    this.points = [this.lt, this.t, this.rt, this.lm, this.rm, this.lb, this.b, this.rb]
    for (const point of this.points) {
      this.box.appendChild(point)
    }
  }

  show () {
    const node = this.component.node
    if (node && !this.status) {
      this.status = true
      this.drawBox(node)
      this.render()
      this.airy.needUpdate = true
    }
  }

  hide () {
    // const node = this.component.node
    // if (node && this.status) {
    //   this.status = false
    //   this.drawBox()
    //   this.airy.app.stage.removeChild(this.box)
    //   this.airy.needUpdate = true
    // }
  }

  initBox () {
  }

  drawBox (node) {
    const location = this.component.getGlobalLocation()

    const styles = {
      box: {
        position: 'absolute',
        left: `${location.x - padding.x}px`,
        top: `${location.y - padding.y}px`,
        padding: `${padding.y}px ${padding.x}px`,
        width: `${node.width + 2 * padding.x}px`,
        height: `${node.height + 2 * padding.y}px`,
        border: `1px solid #ffbd01`,
        boxSizing: 'border-box'
      },
      points: {
        position: 'absolute',
        width: `6px`,
        height: `6px`,
        borderRadius: `50%`,
        border: `1px solid #43abf4`,
        background: `#ffffff`
      },
      lt: {
        left: 0,
        top: 0,
        transform: `translate(-50%, -50%)`
      },
      t: {
        left: `50%`,
        top: 0,
        transform: `translate(-50%, -50%)`
      },
      rt: {
        right: 0,
        top: 0,
        transform: `translate(50%, -50%)`
      },
      lm: {
        left: 0,
        top: `50%`,
        transform: `translate(-50%, -50%)`
      },
      rm: {
        right: 0,
        top: `50%`,
        transform: `translate(50%, -50%)`
      },
      lb: {
        left: 0,
        bottom: 0,
        transform: `translate(-50%, 50%)`
      },
      b: {
        left: `50%`,
        bottom: 0,
        transform: `translate(-50%, 50%)`
      },
      rb: {
        right: 0,
        bottom: 0,
        transform: `translate(50%, 50%)`
      }
    }

    const { classes } = this.airy.jss.createStyleSheet(styles).attach()
    this.box.className = classes.box
    this.lt.classList = `${classes.points} ${classes.lt}`
    this.t.classList = `${classes.points} ${classes.t}`
    this.rt.classList = `${classes.points} ${classes.rt}`
    this.lm.classList = `${classes.points} ${classes.lm}`
    this.rm.classList = `${classes.points} ${classes.rm}`
    this.lb.classList = `${classes.points} ${classes.lb}`
    this.b.classList = `${classes.points} ${classes.b}`
    this.rb.classList = `${classes.points} ${classes.rb}`
  }

  render () {
    this.airy.container.appendChild(this.box)
  }
}

export default Transform
