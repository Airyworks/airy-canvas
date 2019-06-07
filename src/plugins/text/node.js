import BasicNode from '@/plugins/basic/node'
// import { Text } from 'pixi.js'
import MultiStyleText from 'pixi-multistyle-text'
import cfg from './airy.plugin'

export default class extends BasicNode {
  constructor ({ airy, stage }, setting) {
    super(airy)
    this.type = cfg.name
    this.airy = airy
    this.stage = stage
    this.setting = setting

    this.node = new MultiStyleText('', {
      default: this.setting,
      l1: {
        fontSize: '24px',
        fill: '#66ccff'
      },
      l2: {
        fontStyle: 'italic',
        fill: '#4488ff'
      }
    })
    this.editor = document.createElement('div')
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
    if (this.node.text.trim() !== '') {
      window.ddd = this.node.text
      this.editor.innerHTML = this.node.text.split('\n')
        .map((i) => `<div>${i}</div>`).join('')
    } else {
      this.editor.innerHTML = ''
    }
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
        minHeight: `${this.setting.lineHeight * this.airy.app.stage.scale.y}px`,
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
    this.editor.focus()
    this.node.renderable = false
    this.editor.addEventListener('input', this.listener.changeEvent)
    window.editor = this.editor
  }

  unfocus () {
    this.sheet.detach()
    this.transform.box.removeChild(this.editor)
    const content = this.editor.innerHTML
    console.log(content)
    const text = content.replace(/<div>/g, '\n')
      .replace(/<\/div>/g, '\n')
      .replace(/\n+/g, '\n')
      .replace(/\s+$/, '')
      .replace(/^\s+/, '')
    this.node.text = text
    this.node.renderable = true
    this.editor.removeEventListener('input', this.listener.changeEvent)
  }

  changeEvent (e) {
    this.transform.resize(this.editor.offsetWidth + 8, this.editor.offsetHeight + 4)
  }

  stringify () {
    console.log(this.setting)
    // const setting = this.setting
    // let output = `<${this.type}>0x${setting.color.toString(16)};${setting.width.toFixed(2)};${setting.alpha.toFixed(2)};`
    // output += toFixed(this.path[0].x) + '|' + toFixed(this.path[0].y)
    // this.path.reduce((last, point) => {
    //   output += `,${toFixed(point.x)}|${toFixed(point.y)}`
    //   return point
    // }, this.path[0])
    return 'text component'
  }
}
