module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config.devServer
      .disableHostCheck(true)
    config
      .entry('app')
      .clear()
    config
      .entry('app')
      .add('./src/example.js')
  },
  css: { extract: false }
}
