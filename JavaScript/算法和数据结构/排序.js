const { getRandomNumber } = require('./utils')

const test = []
for (let i = 0; i < 100; i++) {
    test.push(getRandomNumber(0, 100))
}

console.log('测试数据 ----- ', test)

// 默认排序方式为由小到大的方式
// 冒泡和选择这两个就不写了。。。

// 插入排序
function insert (arr) {
    const len = arr.length
    let count = 0

    for (let i = 1; i < len; i++) {
        const c = arr[i]
        arr[i] = undefined

        let j = i - 1
        for (j; j >= 0; j--) {
            count++
            if (arr[j] > c) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            } else {
                break
            }
        }
        arr[j + 1] = c
    }

    console.log(count)
    return arr
}

// console.log(insert(test))

// 双指针
function mergeTwoYouXuArray (one, two) {
    let i = 0
    let j = 0
    const res = []

    while (i < one.length || j < two.length) {
        if (one[i] > two[j] || one[i] === undefined) {
            res.push(two[j])
            j++
        } else {
            res.push(one[i])
            i++
        }
    }

    return res
}

// 归并排序
function guibin (arr) {
    if (arr.length === 1) return arr
    const len = Math.floor(arr.length / 2)

    return mergeTwoYouXuArray(guibin(arr.slice(0, len)), guibin(arr.slice(len)))
}

// console.log(guibin(test))

// 快速排序
function quick (arr) {
    function sort (left, right) {
        // 基准点
        const mix = Math.floor((left + right) / 2)
        const mid = arr[mix]
        const i = left
        const j = right
        while (left <= right) {
            // 左指针右移
            while (arr[left] < mid) {
                left++
            }

            // 右指针左移
            while (arr[right] > mid) {
                right--
            }

            // 如果小于 则左侧还有小于基准值
            if (left <= right) {
                [arr[left], arr[right]] = [arr[right], arr[left]]
                left++
                right--
            }
        }

        // 继续排序
        // 此时 left左侧都是小于 基准值的 右侧都是大于基准值的
        if (left - i > 1) {
            sort(i, left - 1)
        }

        if (j - right > 1) {
            sort(left, j)
        }
    }

    sort(0, arr.length - 1)
    return arr
}
console.log(quick(test))
