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
