import { cloneDeep } from 'lodash'
import AiryCanvas from '@/core/'
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
      },
      active: undefined
    }
  },
  created () {
    this.plugins = defaultPlugins.concat(this._options.plugins).map(Plugin => new Plugin())
  },
  mounted () {
    this.box = this.$refs['airy-box']
    this.airyCanvas = new AiryCanvas(this, this.box, this._options, this.plugins, cloneDeep(this.data))
    window.airyCanvas = this.airyCanvas
    console.log(process)
    this.active = 'basic-move'
    this.activePlugin(this.active)

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
    },
    activePlugin (activeName) {
      const plugin = this.plugins.find(p => p.name === activeName)
      if (plugin) {
        this.active = plugin
        if (this.airyCanvas) {
          this.airyCanvas.activePlugin = plugin
        }
      }
    },
    updateConfig (name, cfg) {
      const plugin = this.plugins.find(p => p.name === name)
      plugin.updateSetting(cfg)
    }
  }
}
