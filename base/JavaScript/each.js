const { isFunction } = require('./utils')

function createIndexFinder (dir) {
    return function (arr, i, fn) {
        if (isFunction(i)) {
            fn = i
            i = 0
        }

        if (dir > 0) {
            if (i < 0) {
                // 如果 i 小于 0 则取 0
                i = Math.max(0, arr.length + i)
            }
        } else {
            if (i < 0) {
                i = Math.max(-1, arr.length - 1 + i)
            }
        }

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
 ** @param value 需要查找得值
 ** @param {Function} fn 每次循环时候的回调函数 根据返回值进行比较
 **/
function sortIndex (arr, value, fn) {
    let start = 0
    let end = arr.length

    while (start < end) {
        const mid = Math.floor((end - start) / 2) + start

        if (fn(arr[mid]) > fn(value)) {
            end = mid
        } else {
            start = mid + 1
        }
    }

    return start
}

function indexOfcFunc (value) {
    return (item) => {
        if (Number.isNaN(value) && Number.isNaN(item)) {
            return true
        } else {
            return item === value
        }
    }
}

/**
 ** @param {Array} arr 需要查找的数组
 ** @param value 需要查找的值
 ** @param {(number | boolean)?} fromIndex 从哪里开始找
 * 设定开始查找的位置。如果该索引值大于或等于数组长度，意味着不会在数组里查找，返回 -1。如果参数中提供的索引值是一个负值，则将其作为数组末尾的一个抵消，即 -1 表示从最后一个元素开始查找，-2 表示从倒数第二个元素开始查找 ，以此类推。 注意：如果参数中提供的索引值是一个负值，仍然从前向后查询数组。如果抵消后的索引值仍小于 0，则整个数组都将会被查询。其默认值为 0。
 **/
function indexOf (arr, value, fromIndex) {
    if (typeof fromIndex === 'boolean') {
        const i = sortIndex(arr, value, (item) => item) - 1
        return arr[i] === value ? i : -1
    }
    return createIndexFinder(1)(arr, fromIndex, indexOfcFunc(value))
}

/**
 ** @param {Array} arr 需要查找的数组
 ** @param value 需要查找的值
 ** @param {(number | boolean)?} fromIndex 从哪里开始找
 * 从此位置开始逆向查找。默认为数组的长度减 1，即整个数组都被查找。如果该值大于或等于数组的长度，则整个数组会被查找。如果为负值，将其视为从数组末尾向前的偏移。即使该值为负，数组仍然会被从后向前查找。如果该值为负时，其绝对值大于数组长度，则方法返回 -1，即数组不会被查找。
 **/
function lastIndexOf (arr, value, fromIndex) {
    return createIndexFinder(-1)(arr, fromIndex, indexOfcFunc(value))
}

console.log(indexOf([1, 2, 3, 4, 5], 4, true))

console.log(lastIndexOf([1, 2, 3, 4], 2, -1))

console.log(sortIndex([{ age: 0 }], { age: 1 }, function (item) {
    return item.age
}))

console.log(sortIndex([0, 1, 2, 3, 4], -1, function (item) {
    return item
}))

console.log(findIndex([12, 5, 8, 130, 44], 4, function isBigEnough (element, i) {
    return element > 15
}))

console.log(findLastIndex([12, 5, 8, 130, 44], 3, function isBigEnough (element, i) {
    return element < 9
}))
