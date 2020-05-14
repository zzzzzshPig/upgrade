/*
题目描述：使用栈实现队列的下列操作：
push(x) -- 将一个元素放入队列的尾部。
pop() -- 从队列首部移除元素。
peek() -- 返回队列首部的元素。
empty() -- 返回队列是否为空。
*/
/**
 * Initialize your data structure here.
 */
function MyQueue () {
    this.stack = []
    this.stack2 = []
}

/**
 * Push element x to the back of queue.
 * @param {number} x
 * @return {void}
 */
MyQueue.prototype.push = function (x) {
    this.stack.push(x)
}

/**
 * Removes the element from in front of queue and returns that element.
 * @return {number}
 */
MyQueue.prototype.pop = function () {
    if (!this.stack2.length) {
        // 将stack中的元素pop到stack2中
        let s = this.stack.pop()
        while (s) {
            this.stack2.push(s)
            s = this.stack.pop()
        }
    }

    return this.stack2.pop()
}

/**
 * Get the front element.
 * @return {number}
 */
MyQueue.prototype.peek = function () {
    if (!this.stack2.length) {
        // 将stack中的元素pop到stack2中
        let s = this.stack.pop()
        while (s) {
            this.stack2.push(s)
            s = this.stack.pop()
        }
    }

    return this.stack2[this.stack2.length - 1]
}

/**
 * Returns whether the queue is empty.
 * @return {boolean}
 */
MyQueue.prototype.empty = function () {
    return !this.stack2.length && !this.stack.length
}

/**
 * Your MyQueue object will be instantiated and called as such:
 * var obj = new MyQueue()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.peek()
 * var param_4 = obj.empty()
 */

/*
* 题目描述：给定一个数组 nums 和滑动窗口的大小 k，请找出所有滑动窗口里的最大值。
* 示例: 输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3 输出: [3,3,5,5,6,7]

解释: 滑动窗口的位置
---------------
[1 3 -1] -3 5 3 6 7
1 [3 -1 -3] 5 3 6 7
1 3 [-1 -3 5] 3 6 7
1 3 -1 [-3 5 3] 6 7
1 3 -1 -3 [5 3 6] 7
1 3 -1 -3 5 [3 6 7]

最大值分别对应：
3 3 5 5 6 7

提示：你可以假设 k 总是有效的，在输入数组不为空的情况下，1 ≤ k ≤ 输入数组的大小。
* */
function maxSlidingWindow (nums, k) {
    const dequeue = []
    const res = []

    let i = 0
    for (const a of nums) {
        i++

        while (a > dequeue[dequeue.length - 1]) {
            dequeue.pop()
        }

        dequeue.push(a)

        if (i >= k) {
            if (nums[i - k - 1] === dequeue[0]) {
                dequeue.shift()
            }
            res.push(dequeue[0])
        }
    }

    return res
}
console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3))
