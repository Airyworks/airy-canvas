import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt'

library.add(faTrashAlt)

class Submenu {
  constructor (airy, component) {
    this.airy = airy
    this.component = component
    this.dom = null
    dom.watch()
    this.init = false
  }

  initContent () {
    const dom = document.createElement('div')
    const left = document.createElement('div')
    const right = document.createElement('div')
    dom.append(left)
    dom.append(right)
    left.appendChild(this.getLeft())
    right.appendChild(this.getRight())
    this.dom = dom
    this.left = left
    this.right = right
  }

  getContent () {
    if (!this.init) {
      this.init = true
      this.initContent()
    }
    return this.dom
  }

  getStyles () {
    return {
      submenu: {
        display: 'flex',
        height: '100%'
      },
      submenuLeft: {
        height: '100%'
      },
      submenuRight: {
        height: '100%'
      },
      ...this.getRightStyle(),
      ...this.getLeftStyle()
    }
  }

  mountStyle (sheet) {
    const { classes } = sheet
    this.mountRightStyle(sheet)
    this.mountLeftStyle(sheet)
    this.dom.className = classes.submenu
    this.left.className = classes.submenuLeft
    this.right.className = classes.submenuRight
  }

  wrapFont (font) {
    const wrapper = document.createElement('span')
    const i = document.createElement('i')
    i.classList = `fas ${font}`
    wrapper.appendChild(i)
    return wrapper
  }

  getRight () {
    const dom = document.createElement('div')
    dom.appendChild(this.wrapFont('fa-trash-alt'))
    dom.addEventListener('click', e => {
      this.airy.store.removeByUuid(this.component.uuid)
    })
    this.rightDom = dom
    return dom
  }

  getRightStyle () {
    return {
      submenuDelete: {
        fontSize: '1em',
        cursor: 'pointer'
      }
    }
  }

  mountRightStyle (sheet) {
    const { classes } = sheet
    this.rightDom.className = classes.submenuDelete
  }

  getLeft () {
    const dom = document.createElement('div')
    return dom
  }

  getLeftStyle () {
    return {}
  }

  mountLeftStyle (sheet) {}
}

export default Submenu
