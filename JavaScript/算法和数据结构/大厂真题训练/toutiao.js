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
