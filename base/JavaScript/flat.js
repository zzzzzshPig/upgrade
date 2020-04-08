/**
 * 数组扁平化 根据level决定 扁平几层
 * @param  {Array} array  需要扁平的数组
 * @param  {Number} level  扁平层数
 */
function flat(array, level = 1) {
	let res = []

	for (let a of array) {
		if (Array.isArray(a) && level > 0) {
			res.push(...flat(a, level - 1))
		} else {
			res.push(a)
		}
	}

	return res
}

let testa = [1, 2, 3, [4, 5, [1, 2, 3]], 6, 7, 8, 9, 10]

/*
console.log(flat(testa, 0))
console.log(testa)
console.log(testa.flat(0))
console.log(testa)
*/

/**
 * 数组扁平化
 * @param  {Array} array  需要扁平的数组
 * @param  {Boolean} shallow  是否只扁平一层
 * @param  {boolean} strict  是否严格处理元素，下面有解释
 * @return {Array}
 */
function flatten(array, shallow, strict) {
	let res = []

	for (let a of array) {
		if (Array.isArray(a)) {
			if (shallow) {
				a.forEach(b => {
					res.push(b)
				})
			} else {
				res.push(...flatten(a, shallow, strict))
			}
		} else if (!strict) {
			res.push(a)
		}
	}

	return res
}

let testb = [1]
for (let i = 0; i < 10000; i++) {
    testb = [testb]
}
console.log(testb)
console.log(flatten(testb, false, false))
