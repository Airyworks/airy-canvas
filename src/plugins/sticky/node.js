import BasicNode from '@/plugins/basic/node'
import { Container, Graphics, Sprite } from 'pixi.js'
import MultiStyleText from 'pixi-multistyle-text'
import cfg from './airy.plugin'

export default class extends BasicNode {
  constructor ({ airy, stage }, setting) {
    super(airy)
    this.type = cfg.name
    this.airy = airy
    this.stage = stage
    this.setting = setting

    this.node = new Container()
    this.text = new MultiStyleText('', {
      default: Object.assign({
        wordWrap: true,
        wordWrapWidth: this.setting.sticky.width - 2 * this.setting.sticky.padding
      }, this.setting.text),
      l1: {
        fontSize: '24px',
        fill: '#66ccff'
      },
      l2: {
        fontStyle: 'italic',
        fill: '#4488ff'
      }
    })
    this.resizeSticky()
    this.node.addChild(this.text)
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

  setTextPosition () {
    const { padding } = this.setting.sticky
    this.text.x = padding
    this.text.y = padding
    console.log(this.text)
  }

  resizeSticky (width = this.setting.sticky.width,
    height = this.setting.sticky.height, color = this.setting.sticky.color) {
    const graphics = new Graphics()
    graphics.beginFill(color)
    graphics.drawRect(0, 0, width, height)
    graphics.endFill()
    const sticky = new Sprite(graphics.generateCanvasTexture())
    if (this.background) {
      this.node.removeChild(this.background)
    }
    this.background = sticky
    this.node.addChild(this.background)
    this.node.setChildIndex(this.background, 0)
    this.setTextPosition()
  }

  edit () {}

  focusEvent (e) {
    if (this.text.text.trim() !== '') {
      this.editor.innerHTML = this.text.text.split('\n')
        .map((i) => `<div>${i}</div>`).join('')
    } else {
      this.editor.innerHTML = ''
    }
    const { x: left, y: top } = this.transform.padding
    const textSetting = this.setting.text
    const stickySetting = this.setting.sticky
    const scale = this.airy.app.stage.scale.y
    const styles = {
      editor: {
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${stickySetting.width}px`,
        padding: `${stickySetting.padding * scale}px`,
        boxSizing: 'border-box',
        margin: 0,
        cursor: 'text',
        fontSize: `${textSetting.fontSize * scale}px`,
        fontStyle: textSetting.fontStyle,
        lineHeight: `${textSetting.lineHeight * scale}px`,
        minHeight: `${textSetting.lineHeight * scale}px`,
        color: textSetting.fill,
        fontFamily: textSetting.fontFamily,
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        outline: 'none'
      }
    }
    this.editor.contentEditable = 'true'
    this.sheet = this.airy.jss.createStyleSheet(styles)
    this.sheet.attach()
    const { classes } = this.sheet
    this.editor.className = classes.editor
    this.transform.box.appendChild(this.editor)
    this.editor.focus()
    this.text.renderable = false
    this.editor.addEventListener('input', this.listener.changeEvent)
    window.editor = this.editor
  }

  unfocus () {
    this.sheet.detach()
    this.transform.box.removeChild(this.editor)
    const content = this.editor.innerHTML
    const text = content.replace(/<div>/g, '\n')
      .replace(/<\/div>/g, '\n')
      .replace(/\n+/g, '\n')
      .replace(/\s+$/, '')
      .replace(/^\s+/, '')
    this.text.text = text
    this.text.renderable = true
    this.editor.removeEventListener('input', this.listener.changeEvent)
    this.resizeSticky()
  }

  changeEvent (e) {
    // this.transform.resize(this.editor.offsetWidth + 8, this.editor.offsetHeight + 4)
  }
}
