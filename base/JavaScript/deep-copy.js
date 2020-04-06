let types = {}
'Date Error RegExp Number String Boolean Function Object Array Null Undefined Symbol'.split(' ').forEach(a => {
	types[`[object ${a}]`] = a.toLocaleLowerCase()
})

function getType (v) {
	if (v == null) return `${v}`

	return types[Object.prototype.toString.call(v)]
}

function deepCopy (obj) {
	const type = getType(obj)
	if (type !== 'object' && type !== 'array') return obj

	let res = type === 'object' ? {} : []

	for (let k in obj) {
		let t = getType(obj[k])
		if (t === 'object' || t === 'array') {
			res[k] = deepCopy(obj[k])
		} else {
			res[k] = obj[k]
		}
	}

	return res
}

let a = {
	b: {
		c: 1,
		cc: {
			ccc: 2
		}
	},
	d: [0, {
		e: 2
	}]
}
let b = deepCopy(a)
a.b.c++
a.d[0]++
a.d[1].e++
console.log(a, b, deepCopy(1))
