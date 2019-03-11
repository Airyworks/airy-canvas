import Vue from 'vue'
import Example from './Example.vue'

import test from '.'

Vue.use(test)

Vue.config.productionTip = false

new Vue({
  render: h => h(Example)
}).$mount('#app')
