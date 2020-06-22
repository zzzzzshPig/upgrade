// 最长上升子序列 https://leetcode-cn.com/problems/longest-increasing-subsequence/
function lengthOfLIS (nums) {
	if (nums.length === 0) return 0

	let dp = new Array(nums.length).fill(1)
	let res = 1

	for (let i = 1; i < nums.length; i++) {
		for (let j = 0; j < i; j++) {
			if (nums[j] < nums[i]) {
				dp[i] = Math.max(dp[i], dp[j] + 1)
			}
		}

		if (dp[i] > res) {
			res = dp[i]
		}
	}

	return res
}

// 零钱兑换 https://leetcode-cn.com/problems/coin-change/
function coinChange (coins, amount) {
	// 状态转移方程 f(n) = Math.min(f(n - c1) + 1, f(n - cn) + 1)

	const f = [0]

	for (let i = 1; i <= amount; i++) {
		f[i] = Infinity

		for (let j = 0; j < coins.length; j++) {
			if (i - coins[j] >= 0) {
				f[i] = Math.min(f[i], f[i - coins[j]] + 1)
			}
		}
	}

	if (f[amount] === Infinity) return -1

	return f[amount]
}

// 不同路径 II https://leetcode-cn.com/problems/longest-palindromic-substring/
function uniquePathsWithObstacles (obstacleGrid) {
	if (!obstacleGrid.length) return 0
	const m = obstacleGrid.length
	const n = obstacleGrid[0].length

	// f(n, m) = f(n - 1, m) + f(n, m - 1)
	const left = []
	for (let i = 0; i < m; i++) {
		left.push((obstacleGrid[i][0] === 1 || left[i - 1] === 0) ? 0 : 1)
	}

	const dp = []
	for (let i = 0; i < n; i++) {
		dp.push((obstacleGrid[0][i] === 1 || dp[i - 1] === 0) ? 0 : 1)
	}

	for (let i = 1; i < m; i++) {
		dp[0] = left[i]
		for (let j = 1; j < 2; j++) {
			dp[j] = obstacleGrid[i][j] === 1 ? 0 : dp[j] + dp[j - 1]
		}
	}
	return dp[dp.length - 1]
}

// 解码方法 https://leetcode-cn.com/problems/decode-ways/
function numDecodings (s) {
	// f(n) = f(n - 1) + f(n - 2)
	// 头部是0 return 0
	if (s[0] === '0') return 0

	const dp = [1]
	for (let i = 1; i < s.length; i++) {
		const a = Number(s[i - 1] + s[i])

		if (a < 27 && a > 9) {
			if (s[i] === '0') {
				dp[i] = dp[i - 2] || 1
			} else {
				dp[i] = dp[i - 1] + (dp[i - 2] || 1)
			}
		} else {
			// 存在 00 或者 30 40 等 return 0
			if (s[i] === '0') return 0
			dp[i] = dp[i - 1]
		}
	}

	return dp[s.length - 1]
}
/*const tests = ['1', '10', '01', '16205', '100', '101', '1001', '1010', '12', '226', '110', '1101', '1110']
tests.forEach(a => {
	console.log(a, numDecodings(a))
})*/

// 乘积最大子数组 https://leetcode-cn.com/problems/maximum-product-subarray/
function maxProduct (nums) {
	let max = nums[0]
	let min = nums[0]
	let res = nums[0]

	for (let i = 1; i < nums.length; i++) {
		if (nums[i] < 0) {
			[max, min] = [min, max]
		}

		max = Math.max(nums[i] * max, nums[i])
		min = Math.min(nums[i] * min, nums[i])

		res = Math.max(max, res)
	}

	return res
}
/*
const tests = [[-2,-3,7], [2,3,-2,4], [-2,0,-1], [2,-3,-2,-7], [0,-1,4,-4,5,-2,-1,-1,-2,-3,0,-3,0,1,-1,-4,4,6,2,3,0,-5,2,1,-4,-2,-1,3,-4,-6,0,2,2,-1,-5,1,1,5,-6,2,1,-3,-6,-6,-3,4,0,-2,0,2]]
tests.forEach(a => {
	console.log(a, maxProduct(a))
})
*/

// 打家劫舍 II https://leetcode-cn.com/problems/house-robber-ii/
function rob (nums) {
	// f(n) = Math.max(f(n - 1), f(n - 2) + nums[i])
	let dp = []
	let dp1 = []
	for (let i = 0; i < nums.length - 1; i++) {
		dp[i] = Math.max(( dp[i - 2] || 0) + nums[i], dp[i - 1] || 0)

		if (i > 0) {
			dp1[i] = Math.max((dp1[i - 2] || 0) + nums[i], dp1[i - 1] || 0)
		}
	}

	let last = nums.length - 1
	dp1[last] = Math.max((dp1[last - 2] || 0) + nums[last], dp1[last - 1] || 0)

	return Math.max(dp[dp.length - 1] || 0, dp1[dp1.length - 1] || 0, nums[0] || 0)
}
/*
const tests = [[], [1], [2,3,2], [1,2,3,1], [12,131,44124,51,512,5243,534,6547,5687,659,677,35,436,43,0,70,6,235,34763,5,135,14,2,4,5645,65346,36,25,356,47,4,37,45,364,74,746,47,46,45,456,3426,6,36,245,435,235,246,236,3467,3,7357,46,635,345,353,534,5,53,55,5,5,5,5,5,5], [2,7,9,3,1], [1,1,1,1,1,1,1,1,1,1,1,1], [2,3,2,1,23,4,245435,35356,363,44,24,256,435,363,63,2,4]]
tests.forEach(a => {
	console.log(a, rob(a))
})
console.log(rob([2,7,9,3,1]))
*/

// 最大正方形 https://leetcode-cn.com/problems/maximal-square/
function maximalSquare (matrix) {
	// f(n, m) = 1 + Math.min(f(n, m - 1), f(n - 1, m), f(n - 1, m - 1))
	let res = matrix.filter(a => a.includes('1')).length ? 1 : 0

	for (let i = 1; i < matrix.length; i++) {
		for (let j = 1; j < matrix[i].length; j++) {
			if (matrix[i][j] === '1') {
				matrix[i][j] = 1 + Math.min(matrix[i - 1][j], matrix[i][j - 1], Number(matrix[i - 1][j - 1]))
				res = Math.max(res, matrix[i][j])
			}
		}
	}

	return res * res
}
const tests = [[['1']], [['0'], ['0']], [["1","1","0","0","0"],["1","1","1","1","1"],["1","1","1","1","1"],["1","1","1","1","1"],["1","1","0","0","0"],["1","1","1","1","1"]], [["1","0","1","0","0","1","1","1","0"],["1","1","1","0","0","0","0","0","1"],["0","0","1","1","0","0","0","1","1"],["0","1","1","0","0","1","0","0","1"],["1","1","0","1","1","0","0","1","0"],["0","1","1","1","1","1","1","0","1"],["1","0","1","1","1","0","0","1","0"],["1","1","1","0","1","0","0","0","1"],["0","1","1","1","1","0","0","1","0"],["1","0","0","1","1","1","0","0","0"]]]
tests.forEach(a => {
	console.log(maximalSquare(a))
})
// console.log(maximalSquare([
// 	["1","0","1","0","0","1","1","1","0"],
// 	["1","1","1","0","0","0","0","0","1"],
// 	["0","0","1","1","0","0","0","1","1"],
// 	["0","1","1","0","0","1","0","0","1"],
// 	["1","1","0","1","1","0","0","1","0"],
// 	["0","1","1","1","1","1","1","0","1"],
// 	["1","0","1","1","1","0","0","1","0"],
// 	["1","1","1","0","1","0","0","0","1"],
// 	["0","1","1","1","1","0","0","1","0"],
// 	["1","0","0","1","1","1","0","0","0"]
// ]))
