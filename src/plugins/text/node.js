import BasicNode from '@/plugins/basic/node'
import { Text } from 'pixi.js'
import cfg from './airy.plugin'

export default class extends BasicNode {
  constructor ({ airy, stage }, setting) {
    super(airy)
    this.type = cfg.name
    this.airy = airy
    this.stage = stage
    this.setting = setting

    this.node = new Text('', this.setting)
    this.editor = document.createElement('p')
    this.editor.addEventListener('mousedown', (e) => {
      console.log('editor mousedown')
      e.stopPropagation()
    })

    this.listener = {
      changeEvent: this.changeEvent.bind(this)
    }
  }

  position (local) {
    this.node.x = local.x
    this.node.y = local.y - this.node.height / 2
  }

  edit () {}

  focusEvent (e) {
    this.editor.textContent = this.node.text
    const { x: left, y: top } = this.transform.padding
    const styles = {
      editor: {
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        margin: 0,
        cursor: 'text',
        whiteSpace: 'nowrap',
        fontSize: `${this.setting.fontSize * this.airy.app.stage.scale.y}px`,
        fontStyle: this.setting.fontStyle,
        lineHeight: `${this.setting.lineHeight * this.airy.app.stage.scale.y}px`,
        color: this.setting.fill,
        fontFamily: this.setting.fontFamily
      }
    }
    this.editor.contentEditable = 'true'
    this.sheet = this.airy.jss.createStyleSheet(styles)
    this.sheet.attach()
    const { classes } = this.sheet
    this.editor.className = classes.editor
    this.transform.box.appendChild(this.editor)
    console.log('this.editor.focus()')
    this.editor.focus()
    this.node.renderable = false
    this.editor.addEventListener('input', this.listener.changeEvent)
    // throw new Error('d')
  }

  unfocus () {
    this.sheet.detach()
    this.transform.box.removeChild(this.editor)
    // write back value
    this.node.text = this.editor.textContent
    // diaplay
    this.node.renderable = true
    this.editor.removeEventListener('input', this.listener.changeEvent)
  }

  changeEvent (e) {
    console.log(this.editor.offsetWidth, this.editor.offsetHeight, this.node)
    this.transform.resize(this.editor.offsetWidth + 8, this.editor.offsetHeight + 4)
  }
}
