import AiryCanvas from '@/main/'
import { cloneDeep } from 'lodash'

const defaultOptions = {
  width: 1000,
  height: 600,
  fluid: false
}

export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return {
          history: []
        }
      }
    },
    options: {
      type: Object,
      default: () => {
        return cloneDeep(defaultOptions)
      }
    }
  },
  computed: {
    _options () {
      return Object.assign(defaultOptions, this.options)
    },
    boxSize () {
      return {
        width: this._options.fluid ? '100%' : this._options.width + 'px',
        height: this._options.fluid ? '100%' : this._options.height + 'px'
      }
    }
  },
  data () {
    return {
      canvasSize: {
        width: 0,
        height: 0
      }
    }
  },
  mounted () {
    this.box = this.$refs['airy-box']
    this.airyCanvas = new AiryCanvas(this.box, this._options)
    window.addEventListener('resize', this.resize)
    this.resize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize () {
      if (this._options.fluid) {
        this.airyCanvas.resize()
      }
    }
  }
}
