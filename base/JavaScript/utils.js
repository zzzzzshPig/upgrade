let types = {}
'Date Error RegExp Number String Boolean Function Object Array Null Undefined Symbol'.split(' ').forEach(a => {
	types[`[object ${a}]`] = a.toLocaleLowerCase()
})

function getType (v) {
	if (v == null) return `${v}`

	return types[Object.prototype.toString.call(v)]
}

function isArray (v) {
	return getType(v) === 'array'
}

function isObject (v) {
	return getType(v) === 'object'
}

function isFunction (v) {
	return getType(v) === 'function'
}

async function sleep (ms) {
	await new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}

module.exports = {
	getType,
	isArray,
	isObject,
	isFunction,
	sleep
}
