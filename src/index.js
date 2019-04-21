import AiryCanvas from './AiryCanvas'

AiryCanvas.install = Vue => {
  Vue.component('AiryCanvas', AiryCanvas)

  // Vue.prototype.$airyCtx = new Context()
}

export default AiryCanvas
