import BasicNode from '@/plugins/basic/node'
import { Text } from 'pixi.js'

export default class extends BasicNode {
  constructor ({ airy, stage }, setting) {
    super(airy)
    this.airy = airy
    this.stage = stage
    this.setting = setting

    this.node = new Text('Rich text with a lot of options and across multiple lines', this.setting)
  }

  // render () {
  //   this.stage.addChild(this.node)
  // }

  position (local) {
    this.node.x = local.x
    this.node.y = local.y - this.node.height / 2
  }

  edit () {}

  onclick (e) {
    const editor = document.createElement('p')
    editor.textContent = this.node.text
    const { container } = this.airy
    // console.log(container, editor, this.node)
    // console.log(e.data.global.x / this.airy.app.screen.width,
    //   e.data.global.y / this.airy.app.screen.height)
    // console.log(this, this.airy, )
    const location = this.getGlobalLocation()
    console.log(location)
    const styles = {
      editor: {
        position: 'absolute',
        left: `${location.x}px`,
        top: `${location.y}px`
      }
    }
    const { classes } = this.airy.jss.createStyleSheet(styles).attach()
    editor.classList.add(classes.editor)
    container.appendChild(editor)
  }
}
