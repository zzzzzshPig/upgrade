const {isFunction} = require('./utils')

function createIndexFinder (dir) {
	return function (arr, i, fn) {
		if (isFunction(i)) {
			fn = i
			i = 0
		}

		i = dir > 0 ? i : arr.length - 1 - i

		for (i; i < arr.length && i >= 0; i += dir) {
			if (fn(arr[i], i, arr)) {
				return i
			}
		}
		return -1
	}
}

/**
 ** @param {Array} arr 需要查找的数组
 ** @param {Number?} index 从开始的第几项开始找
 ** @param {Function} fn 每次循环时候的回调函数 返回满足此回调函数的项的下标
 **/

function findIndex (arr, index, fn) {
	return createIndexFinder(1)(arr, index, fn)
}

/**
 ** @param {Array} arr 需要查找的数组
 ** @param {Number?} index 从结尾的第几项开始找
 ** @param {Function} fn 每次循环时候的回调函数 返回满足此回调函数的项的下标
 **/
function findLastIndex (arr, index, fn) {
	return createIndexFinder(-1)(arr, index, fn)
}

/**
 ** @param {Array} arr 需要查找的数组
 ** @param value 插入的值
 ** @param {Function} fn 每次循环时候的回调函数 根据返回值进行比较
 **/
function sortIndex(arr, value, fn) {
	let start = 0
	let end = arr.length

	while (start < end) {
		let mid = Math.floor((end - start) / 2) + start

		if (fn(arr[mid]) > fn(value)) {
			end = mid
		} else {
			start = mid + 1
		}
	}

	return start
}

console.log(sortIndex([{age: 0}], {age: 1}, function (item) {
	return item.age
}))

console.log(sortIndex([0,1,2,3,4], -1, function (item) {
	return item
}))

console.log(findIndex([12, 5, 8, 130, 44], 4, function isBigEnough(element, i) {
	return element > 15
}))

console.log(findLastIndex([12, 5, 8, 130, 44], 3, function isBigEnough(element, i) {
	return element < 9
}))
