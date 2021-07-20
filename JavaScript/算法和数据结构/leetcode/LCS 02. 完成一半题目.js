/**
 * @param {number[]} questions
 * @return {number}
 */
var halfQuestions = function(questions) {
    // 题意梳理，有N个人选题，最少包含几种题(1,2,3表示三种，1,1表示一种)
    // 优先取出现次数最多的题
    let arr = []

    questions.forEach(a => {
        arr[a] = (arr[a] + 1) || 1
    })

    let n = questions.length / 2
    arr = arr.filter(a => a).sort((a, b) => b - a)

    for (let i = 0; i < arr.length; i++) {
        n -= arr[i]

        if (n <= 0) {
            return i + 1
        }
    }

    return n
};
