const {isArray, isObject, getType, isFunction} = require('./utils')

function isArrayOrObjectOrFunction (v) {
	return isObject(v) || isArray(v) || isFunction(v)
}

// [deep] target, [obj1], [objN]
function extend () {
	let deep = false
	let target = arguments[0]
	let i = 1
	if (getType(arguments[0]) === 'boolean') {
		deep = arguments[0]
		target = arguments[1]
		i = 2
	}

	if (!isArrayOrObjectOrFunction(target)) return target

	for (i; i < arguments.length; i++) {
		const a = arguments[i]

		if (isArrayOrObjectOrFunction(a)) {
			for (let k in a) {
				// if a as function object array
				// if deep as true
				// target[k] is undefined  target[k] = a[k]
				// target[k] is base value target[k] = a[k]
				// target is function target[k] = a[k]
				// target[k] is Object target[k][k] = a[k]
				// a[k] is Object, extend a[k]

				// else target[k] = a[k]

				if (a[k] === target) {
					continue
				}

				if (deep && isArrayOrObjectOrFunction(a[k])) {
					if (isArrayOrObjectOrFunction(target[k])) {
						extend(deep, target[k], a[k])
					} else {
						const res = isArray(a[k]) ? [] : {}
						target[k] = extend(deep, res, a[k])
					}
				} else {
					target[k] = a[k]
				}
			}
		}
	}

	return target
}

const obj1 = {
	a: 1,
	b: { b1: 1, b2: 2 },
	d: () => {}
};

const obj2 = {
	b: { b1: 3, b3: 4 },
	c: obj1
};

const obj3 = {
	d: obj2
}

console.log(extend(true, obj1, obj2, obj3));

