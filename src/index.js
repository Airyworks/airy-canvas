import AiryCanvas from './AiryCanvas'
// import Context from '@/model/Context'

AiryCanvas.install = Vue => {
  Vue.component('AiryCanvas', AiryCanvas)

  // Vue.prototype.$airyCtx = new Context()
}

export default AiryCanvas
