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

	// f(n, m) = f(n - 1, m) + f(n, m - 1)
	const left = []
	for (let i = 0; i < obstacleGrid.length; i++) {
		left.push((obstacleGrid[i][0] === 1 || left[i - 1] === 0) ? 0 : 1)
	}

	const dp = []
	if (obstacleGrid[0]) {
		for (let i = 0; i < obstacleGrid[0].length; i++) {
			dp.push((obstacleGrid[0][i] === 1 || dp[i - 1] === 0) ? 0 : 1)
		}
	}

	const len1 = obstacleGrid.length
	const len2 = obstacleGrid[0].length
	for (let i = 1; i < len1; i++) {
		dp[0] = left[i]
		for (let j = 1; j < len2; j++) {
			dp[j] = obstacleGrid[i][j] === 1 ? 0 : dp[j] + dp[j - 1]
		}
	}
	return dp[dp.length - 1]
}
