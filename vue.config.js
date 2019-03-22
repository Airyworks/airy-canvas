module.exports = {
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
