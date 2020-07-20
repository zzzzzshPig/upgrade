// 接雨水 https://leetcode-cn.com/problems/trapping-rain-water/
/*
* 这道题我是用栈的思路做的
* 主要是注意出栈的时机，左侧比右侧小则出栈
* */
function trap (height) {
	const stack = []
	let res = 0

	for (let i = 0; i < height.length; i++) {
		for (let j = stack.length - 1; j >= 0; j--) {
			const last = stack[j]
			let max = Math.min(height[last], height[i])

			let left = last + 1
			while (left < i) {
				res += max - height[left]
				height[left] = max
				left++
			}

			// 左侧比右侧小 出栈
			if (height[last] <= height[i]) {
				stack.pop()
			} else {
				break
			}
		}

		if (height[i] !== 0) {
			stack.push(i)
		}
	}

	return res
}
// console.log(trap([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,1,123,44,2,6,7,2,467,3,54,753,4,142,51,1]))

// 柱状图中最大的矩形 https://leetcode-cn.com/problems/largest-rectangle-in-histogram/
// 下一个元素小于当前元素，则回头向左找不小于f[i] 获取所有的符合条件的值的数量 * f[i]
// 返回值就是最大值
function largestRectangleArea (heights) {
	let res = 0

	for (let i = 0; i < heights.length; i++) {
		// 右找
		if (heights[i] > heights[i + 1] || i === heights.length - 1) {
			// 回头
			let left = i
			let min = heights[i]

			while (left >= 0) {
				min = Math.min(min, heights[left])
				res = Math.max(res, (i - left + 1) * min)

				left--
			}
		}
	}

	return res
}
console.log(largestRectangleArea([2,1,5,6,2,3,1,33,15,235,32467,3,12,1,2,31,2312,41,5,15,16,26,6]))
