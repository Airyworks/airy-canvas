export default class Logger {
  constructor (name) {
    this.name = name
    this.isProduction = process && process.env && process.env.NODE_ENV === 'production'
  }
  static create (name) {
    return new Logger(name)
  }

  /* eslint-disable */
  fatal (...args) {
    console.error(`[${this.name}]`, ...args)
  }
  error (...args) {
    console.error(`[${this.name}]`, ...args)
  }
  warn (...args) {
    console.warn(`[${this.name}]`, ...args)
  }
  info (...args) {
    console.log(`[${this.name}]`, ...args)
  }
  debug (...args) {
    if (!this.isProduction) {
      console.debug(`[${this.name}]`, ...args)
    }
  }
  trace (...args) {
    if (!this.isProduction) {
      console.trace(`[${this.name}]`, ...args)
    }
  }
  /* eslint-enable */
}
