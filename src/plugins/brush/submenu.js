import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import BasicSubmenu from '@/plugins/basic/submenu'
import Selector from '@/plugins/basic/selector'

library.add(faPencilAlt)

export default class extends BasicSubmenu {
  constructor (airy, component) {
    super(airy, component)
    this.thick = new Selector(airy, this.wrapFont('fa-pencil-alt'),
      'range', [1, 6], 1, this.component.setting.width)
    this.thick.change(v => {
      this.component.setting.width = v
      this.component.commit()
    })
  }

  getLeft () {
    const dom = document.createElement('div')
    dom.appendChild(this.thick.getDom())
    return dom
  }

  getLeftStyle () {
    return {}
  }

  mountLeftStyle (sheet) {}
}
