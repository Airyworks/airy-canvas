export default class {
  constructor (airy, icon, type, options, step, val) {
    this.airy = airy
    this.icon = icon
    this.type = type
    this.val = val
    this.fn = undefined
    if (this.type === 'range') {
      this.options = []
      for (let option = options[0]; option <= options[1]; option += step) {
        this.options.push(option)
      }
    }
    if (this.type === 'select') {
      this.options = options
    }
    this.listener = {
      onchange: this.onchange.bind(this)
    }
    this.init()
  }

  init () {
    this.dom = document.createElement('div')
    this.selector = this.initSelector()
    this.dom.appendChild(this.icon)
    this.dom.appendChild(this.selector)
    this.sheet = this.initStyle()
    this.mountStyle()
  }

  initSelector () {
    const selector = document.createElement('select')
    for (const option of this.options) {
      const optionDom = document.createElement('option')
      optionDom.value = option
      optionDom.text = option
      selector.appendChild(optionDom)
    }
    selector.value = this.val
    selector.addEventListener('change', this.listener.onchange)
    return selector
  }

  initStyle () {
    const styles = {
      selector: {
        display: 'flex'
      }
    }
    return this.airy.jss.createStyleSheet(styles).attach()
  }

  mountStyle () {
    const { classes } = this.sheet
    this.dom.className = classes.selector
  }

  getDom () {
    return this.dom
  }

  change (fn) {
    if (typeof fn === 'function') {
      this.fn = fn
    }
  }

  onchange () {
    if (typeof this.val === 'number') {
      this.val = parseFloat(this.selector.value)
    } else {
      this.val = this.selector.value
    }
    if (this.fn) {
      this.fn(this.val)
    }
  }
}
