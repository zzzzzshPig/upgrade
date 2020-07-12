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
// const tests = [[['1']], [['0'], ['0']], [["1","1","0","0","0"],["1","1","1","1","1"],["1","1","1","1","1"],["1","1","1","1","1"],["1","1","0","0","0"],["1","1","1","1","1"]], [["1","0","1","0","0","1","1","1","0"],["1","1","1","0","0","0","0","0","1"],["0","0","1","1","0","0","0","1","1"],["0","1","1","0","0","1","0","0","1"],["1","1","0","1","1","0","0","1","0"],["0","1","1","1","1","1","1","0","1"],["1","0","1","1","1","0","0","1","0"],["1","1","1","0","1","0","0","0","1"],["0","1","1","1","1","0","0","1","0"],["1","0","0","1","1","1","0","0","0"]]]
// tests.forEach(a => {
// 	console.log(maximalSquare(a))
// })
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

// 丑数2 https://leetcode-cn.com/problems/ugly-number-ii/
function nthUglyNumber (n)  {
	let dp = [1]
	let a = 0
	let b = 0
	let c = 0
	for (let i = 0; dp.length <= n; i++) {
		let min = Math.min(dp[a] * 2, dp[b] * 3, dp[c] * 5)

		if (min === dp[a] * 2) {
			a++
		}
		if (min === dp[b] * 3) {
			b++
		}
		if (min === dp[c] * 5) {
			c++
		}

		dp.push(min)
	}

	return dp[n - 1]
}
// const tests = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
// tests.forEach(a => {
// 	console.log(a, nthUglyNumber(a))
// })
// console.log(nthUglyNumber(10))

// 完全平方数 https://leetcode-cn.com/problems/perfect-squares/
/*
先找到最大的不大于n的完全平方数
f(n) = Math.min(f(n - 1) + 1, f(n - 2) + 1)
四平方定理： 任何一个正整数都可以表示成不超过四个整数的平方之和。 推论：满足四数平方和定理的数n（四个整数的情况），必定满足 n=4^a(8b+7)
1.任何正整数都可以拆分成不超过4个数的平方和 ---> 答案只可能是1,2,3,4
2.如果一个数最少可以拆成4个数的平方和，则这个数还满足 n = (4^a)*(8b+7) ---> 因此可以先看这个数是否满足上述公式，如果不满足，答案就是1,2,3了
3.如果这个数本来就是某个数的平方，那么答案就是1，否则答案就只剩2,3了
4.如果答案是2，即n=a^2+b^2，那么我们可以枚举a，来验证，如果验证通过则答案是2
5.只能是3
* */
function numSquares (n) {
	// 公式版本
	while (0 === n % 4) n /= 4
	if (7 === n % 8) return 4

	for (let i = 0; i * i < n; ++i) {
		let j = parseInt(Math.pow(n - i * i, 0.5))
		if (n === i * i + j * j) {
			return !!i + !!j
		}
	}

	return 3

	// dp版本
	/*const dp = [0]
	let costs = []
	let i = 1
	while (i * i <= n) {
		costs.unshift(i * i)
		i++
	}

	for (i = 1; i <= n; i++) {
		dp[i] = Infinity

		for (let j = 0; j < costs.length; j++) {
			if (i - costs[j] >= 0) {
				dp[i] = Math.min(dp[i], dp[i - costs[j]] + 1)
			}
		}
	}

	if (dp[n] === Infinity) return -1

	return dp[n]*/
}
// console.log(numSquares(155))


// 二维区域和检索 - 矩阵不可变 https://leetcode-cn.com/problems/range-sum-query-2d-immutable/
/*
* 初始化 0,0到n,m点的矩形的合
* f(n, m) = f(n - 1, m) + f(n, m - 1) + matrix(n, m) - f(n - 1, m - 1)
* */
function NumMatrix (matrix) {
	const dp = []

	for (let i = 0; i < matrix.length; i++) {
		dp[i] = []

		for (let j = 0; j < matrix[i].length; j++) {
			let t = dp[i - 1] ? dp[i - 1][j] : 0
			let l = dp[i][j - 1] || 0
			let tl = dp[i - 1] ? dp[i - 1][j - 1] || 0 : 0

			dp[i][j] = t + l + matrix[i][j] - tl
		}
	}

	this.dp = dp
}
/**
 * @param {number} row1
 * @param {number} col1
 * @param {number} row2
 * @param {number} col2
 * @return {number}
 */
/*
* 取值的时候取f(row2, col2) - f(row1 - 1, col2) - f(row2, col1 - 1) + f(row1 - 1, col1 - 1)
* */
NumMatrix.prototype.sumRegion = function(row1, col1, row2, col2) {
	let t = this.dp[row1 - 1] ? this.dp[row1 - 1][col2] : 0
	let l = this.dp[row2][col1 - 1] || 0
	let tl = this.dp[row1 - 1] ? this.dp[row1 - 1][col1 - 1] || 0 : 0

	return this.dp[row2][col2] - t - l + tl
}
const nn = new NumMatrix([
	[3, 0, 1, 4, 2],
	[5, 6, 3, 2, 1],
	[1, 2, 0, 1, 5],
	[4, 1, 0, 1, 7],
	[1, 0, 3, 0, 5]
])
/*console.log(nn.sumRegion(2,1,4,3))
console.log(nn.sumRegion(1,1,2,2))
console.log(nn.sumRegion(1,2,2,4))*/


// 整数拆分 https://leetcode-cn.com/problems/integer-break/
/*
* 这道题动态规划没有想出来，倒是找到规律了---
* */
function integerBreak (n) {
	if ( n === 2 ) return 1
	if ( n === 3 ) return 2

	let a = Math.floor(n / 3)
	let b = n % 3

	if (b === 1) {
		return Math.pow(3, a - 1) * 4
	} else if (b === 2) {
		return Math.pow(3, a) * 2
	}

	return Math.pow(3, a)
}

// 矩阵区域和 https://leetcode-cn.com/problems/matrix-block-sum/
// 其实就是求f(x1, y1, x2, y2)内的矩阵和 套用了之前求矩阵和的解法
function matrixBlockSum (mat, K) {
	// i - K <= r <= i + K, j - K <= c <= j + K
	const dp = []
	for (let i = 0; i < mat.length; i++) {
		dp[i] = []

		for (let j = 0; j < mat[i].length; j++) {
			let t = dp[i - 1] ? dp[i - 1][j] : 0
			let l = dp[i][j - 1] || 0
			let tl = dp[i - 1] ? dp[i - 1][j - 1] || 0 : 0

			dp[i][j] = t + l + mat[i][j] - tl
		}
	}

	let res = []
	for (let i = 0; i < mat.length; i++) {
		res.push([])

		for (let j = 0; j < mat[i].length; j++) {
			res[i][j] = sum(Math.max(0, i - K), Math.max(0, j - K), Math.min(i + K, mat.length - 1), Math.min(j + K, mat[i].length - 1))
		}
	}

	function sum (row1, col1, row2, col2) {
		let t = dp[row1 - 1] ? dp[row1 - 1][col2] : 0
		let l = dp[row2][col1 - 1] || 0
		let tl = dp[row1 - 1] ? dp[row1 - 1][col1 - 1] || 0 : 0

		return dp[row2][col2] - t - l + tl
	}

	return res
}
// console.log(matrixBlockSum([[1,2,3],[4,5,6],[7,8,9]], 0))

// 统计全为 1 的正方形子矩阵 https://leetcode-cn.com/problems/count-square-submatrices-with-all-ones/
// 和最大正方形差不多
function countSquares (matrix) {
	let res = 0
	matrix.unshift(Array.from({length: matrix[0].length}).fill(0))
	for (let i = 1; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (matrix[i][j] === 1) {
				res++
				matrix[i][j] = Math.min(matrix[i - 1][j], matrix[i][j - 1] || 0, matrix[i - 1][j - 1] || 0) + 1
				res += matrix[i][j] - 1
			}
		}
	}
	return res
}
/*
console.log(countSquares([
	[1,0,1,1,1,1,1,1,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,1],
	[1,1,0,1,1,1,1,1,1,1,1]
]))
*/

// 不同的二叉搜索树 https://leetcode-cn.com/problems/unique-binary-search-trees/
// dp[n] = dp[0] * dp[n - 1] + dp[1] * dp[n - 2] +  .... + dp[n - 1] * dp[n - n]
function numTrees (n) {
	let dp = [1]

	for (let i = 0; i < n; i++) {
		let d = 0
		for (let j = 1; j <= dp.length; j++) {
			d += dp[j - 1] * dp[dp.length - j]
		}
		dp.push(d)
	}

	return dp[n]
}
for (let i = 1; i < 20; i++) {
	console.log(numTrees(i))
}
