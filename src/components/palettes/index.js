import Vue from 'vue'

import pColor from './Color'
import pNumber from './Number'

function getComponent (type) {
  switch (true) {
    case /Color/.test(type):
      return pColor
    case /Number/.test(type):
    default:
      return pNumber
  }
}

export default Vue.component('Palette', {
  functional: true,
  render (createElement, context) {
    const com = getComponent(context.props.config.type)
    return createElement(com, context.data, context.children)
  }
})
