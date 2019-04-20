import { cloneDeep } from 'lodash'
import AiryCanvas from '@/main/'
import defaultPlugins from '@/plugins/'

const defaultOptions = {
  width: 1000,
  height: 600,
  fluid: false,
  store: undefined,
  plugins: []
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
  created () {
    this.plugins = defaultPlugins.concat(this._options.plugins).map(Plugin => new Plugin())
  },
  mounted () {
    this.box = this.$refs['airy-box']
    this.airyCanvas = new AiryCanvas(this.box, this._options, this.plugins, cloneDeep(this.data))
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
    },
    addPlugin (Plugin) {
      this.plugins.push(new Plugin())
    }
  }
}
