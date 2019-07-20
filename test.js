class A {
  getVal () {
    return this.val()
  }
  val () {
    return 'A'
  }
}

class B extends A {
  val () {
    return 'B'
  }
}

const a = new A()
const b = new B()

console.log(a.getVal(), b.getVal(),
  b.__proto__.getVal(), b.__proto__.__proto__.getVal())

  