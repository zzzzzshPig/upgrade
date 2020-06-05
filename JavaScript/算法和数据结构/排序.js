const { getRandomNumber } = require('./utils')

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

const test = []
for (let i = 0; i < 100; i++) {
    test.push(getRandomNumber(0, 100))
}
console.log(insert(test))
