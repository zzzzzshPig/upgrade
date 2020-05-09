/*
题目描述：给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。

有效字符串需满足： 左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
注意空字符串可被认为是有效字符串。

示例 1:
输入: "()"
输出: true

示例 2:
输入: "()[]{}"
输出: true

示例 3:
输入: "(]"
输出: false

示例 4:
输入: "([)]"
输出: false
示例 5:
输入: "{[]}"
输出: true
* */

/* function isValid (str) {
    const l = []
    const rule = {
        '(': ')',
        '{': '}',
        '[': ']'
    }

    for (let i = 0; i < str.length; i++) {
        if (['(', '{', '['].includes(str[i])) {
            l.push(rule[str[i]])
        } else if (!l.length || (l.pop() !== str[i])) {
            return false
        }
    }

    return !l.length
}
console.log(isValid('{}{}')) */

/*
题目描述: 根据每日气温列表，请重新生成一个列表，对应位置的输出是需要再等待多久温度才会升高超过该日的天数。如果之后都不会升高，请在该位置用 0 来代替。

例如，给定一个列表 temperatures = [73, 74, 75, 71, 69, 72, 76, 73]，你的输出应该是 [1, 1, 4, 2, 1, 1, 0, 0]。

提示：气温 列表长度的范围是 [1, 30000]。每个气温的值的均为华氏度，都是在 [30, 100] 范围内的整数。
* */
/*

function highTemperature (t) {
    if (!t.length) return t

    // 存放i
    const stack = []

    for (let i = 0; i < t.length; i++) {
        while (t[i] > t[stack[stack.length - 1]]) {
            const s = stack.pop()

            // 坐标相减 就是等待天数
            t[s] = i - s
        }

        stack.push(i)
    }

    // 剩余未处理天  后面几天肯定没有比这些天数气温更高的 所以值肯定是0
    for (let i = 0; i < stack.length; i++) {
        t[stack[i]] = 0
    }

    return t
}

console.log(highTemperature([73, 74, 75, 71, 69, 72, 76, 73]))
*/

/*
题目描述：设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。

push(x) —— 将元素 x 推入栈中。
pop() —— 删除栈顶的元素。
top() —— 获取栈顶元素。
getMin() —— 检索栈中的最小元素。

示例:
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin(); --> 返回 -3.
minStack.pop();
minStack.top(); --> 返回 0.
minStack.getMin(); --> 返回 -2.
*/

/**
 * initialize your data structure here.
 */
function MinStack () {
    this.minStack = []
    this.stack = []
}

/**
 * @param {number} x
 * @return {void}
 */
MinStack.prototype.push = function (x) {
    if (this.minStack[this.minStack.length - 1] >= x || !this.minStack.length) {
        this.minStack.push(x)
    }
    this.stack.push(x)
}

/**
 * @return {void}
 */
MinStack.prototype.pop = function () {
    if (this.stack.pop() === this.minStack[this.minStack.length - 1]) {
        this.minStack.pop()
    }
}

/**
 * @return {number}
 */
MinStack.prototype.top = function () {
    return this.stack[this.stack.length - 1]
}

/**
 * @return {number}
 */
MinStack.prototype.getMin = function () {
    return this.minStack[this.minStack.length - 1]
}

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(x)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
