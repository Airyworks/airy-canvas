import BasicNode from '@/plugins/basic/node'
import { Text } from 'pixi.js'

export default class extends BasicNode {
  constructor ({ airy, stage }, setting) {
    super(airy)
    this.airy = airy
    this.stage = stage
    this.setting = setting

    this.node = new Text('Rich text with a lot of options and across multiple lines', this.setting)
    this.editor = document.createElement('p')
    this.editor.addEventListener('mousedown', (e) => {
      console.log('editor mousedown')
      e.stopPropagation()
    })
  }

  position (local) {
    this.node.x = local.x
    this.node.y = local.y - this.node.height / 2
  }

  edit () {}

  onclick (e) {
    this.editor.textContent = this.node.text
    // console.log(container, editor, this.node)
    // console.log(e.data.global.x / this.airy.app.screen.width,
    //   e.data.global.y / this.airy.app.screen.height)
    // console.log(this, this.airy, )
    // const location = this.getGlobalLocation()
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
    this.node.renderable = false
  }

  unfocus () {
    this.sheet.detach()
    this.transform.box.removeChild(this.editor)
    // write back value
    this.node.text = this.editor.textContent
    // diaplay
    this.node.renderable = true
  }
}
