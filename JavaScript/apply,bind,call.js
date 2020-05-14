// apply
//
// function apply(t, arg) {
// 	// null,undefined --> window
// 	// string,number,boolean --> 包装对象
// 	// object function --> t
// 	// symbol --> {}
// 	const r = {
// 		string: String,
// 		number: Number,
// 		boolean: Boolean
// 	}
// 	const type = typeof t
//
// 	if (t === null || t === undefined) {
// 		t = window
// 	} else if (r[type]) {
// 		t = new r[type](t)
// 	} else if (type === 'symbol') {
// 		// symbol 特殊处理
// 		t = {}
// 	}
//
// 	// 唯一标识符
// 	const id = Symbol(1)
// 	// 将this赋值给t 这样this函数的this指向为t
// 	t[id] = this
// 	// 执行this函数 将参数传入
// 	const res = t[id](...arg)
// 	// 将函数从t中删除
// 	delete t[id]
// 	// 返回值
// 	return res
// }
//
// function test(name) {
// 	console.log(this.a, name)
// 	return name
// }
//
// const t = {
// 	a: 'test'
// }
//
// String.prototype.a = 'string'
// Number.prototype.a = 'number'
// Boolean.prototype.a = 'boolean'
// Function.prototype.a = 'function'
// Array.prototype.a = 'array'
// window.a = 'window'
// Symbol.a = 'symbol'
//
// console.log(test.apply(null, ['张三']))
// console.log(test.apply(undefined, ['张三']))
// console.log(test.apply(t, ['张三']))
// console.log(test.apply(1, ['张三']))
// console.log(test.apply('0', ['张三']))
// console.log(test.apply(true, ['张三']))
// console.log(test.apply(() => {
// }, ['张三']))
// console.log(test.apply({a: 'object'}, ['张三']))
// console.log(test.apply([], ['张三']))
// console.log(test.apply(Symbol(1), ['张三']))
// console.log('\n------------------------\n\n')
// test.apply = apply
// console.log(test.apply(null, ['张三']))
// console.log(test.apply(undefined, ['张三']))
// console.log(test.apply(t, ['张三']))
// console.log(test.apply(1, ['张三']))
// console.log(test.apply('0', ['张三']))
// console.log(test.apply(true, ['张三']))
// console.log(test.apply(() => {
// }, ['张三']))
// console.log(test.apply({a: 'object'}, ['张三']))
// console.log(test.apply([], ['张三']))
// console.log(test.apply(Symbol(1), ['张三']))
//
// bind
//
// function bind (t, ...arg) {
//     const self = this
//
//     const res = function (...arg1) {
//         // this instanceof res 用来判断是不是new 或者 this是不是res的实例
//         return self.apply(this instanceof res ? this : t, arg.concat(arg1))
//     }
//     res.prototype = self.prototype
//
//     return res
// }
//
// function test (name) {
//     console.log(this.aaaa)
//     this.name = name
// }
//
// const t = {
//     aaaa: 1
// }
// test.bind(t, '张三')()
// const t1 = test.bind(t, '张三')
// console.log(new t1().name)
//
// console.log('\n--------------------\n\n')
// test.bind = bind
//
// t.aaaa = 2
// test.bind(t, '王麻子')()
// const t2 = test.bind(t, '王麻子')
// console.log(new t2().name)
//
// call
//
// function call (t, ...arg) {
//     // null,undefined --> window
//     // string,number,boolean --> 包装对象
//     // object function --> t
//     // symbol --> {}
//     const r = {
//         string: String,
//         number: Number,
//         boolean: Boolean
//     }
//     const type = typeof t
//
//     if (t === null || t === undefined) {
//         t = window
//     } else if (r[type]) {
//         t = new r[type](t)
//     } else if (type === 'symbol') {
//         // symbol 特殊处理
//         t = {}
//     }
//
//     // 唯一标识符
//     const id = Symbol(1)
//     // 将this赋值给t 这样this函数的this指向为t
//     t[id] = this
//     // 执行this函数 将参数传入
//     const res = t[id](...arg)
//     // 将函数从t中删除
//     delete t[id]
//     // 返回值
//     return res
// }
//
// const t = {
//     a: 1
// }
//
// function test(name) {
// 	return name
// }
//
// console.log(test.call(null, '张三'))
// console.log(test.call(undefined, '张三'))
// console.log(test.call(t, '张三'))
// console.log(test.call(1, '张三'))
// console.log(test.call('0', '张三'))
// console.log(test.call(true, '张三'))
// console.log(test.call(() => {}, '张三'))
// console.log(test.call({a: 'object'}, '张三'))
// console.log(test.call([], '张三'))
// console.log(test.call(Symbol(1), '张三'))
// console.log('\n------------------------\n\n')
// test.call = call
// console.log(test.call(null, '张三'))
// console.log(test.call(undefined, '张三'))
// console.log(test.call(t, '张三'))
// console.log(test.call(1, '张三'))
// console.log(test.call('0', '张三'))
// console.log(test.call(true, '张三'))
// console.log(test.call(() => {}, '张三'))
// console.log(test.call({a: 'object'}, '张三'))
// console.log(test.call([], '张三'))
// console.log(test.call(Symbol(1), '张三'))
