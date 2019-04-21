module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config
      .entry('app')
      .clear()
    config
      .entry('app')
      .add('./src/example.js')
  },
  css: { extract: false }
}
