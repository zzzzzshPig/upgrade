// 二叉树的最近公共祖先 https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree/
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */

/*
* 递归 + 回溯
* */
function lowestCommonAncestor(root, p, q) {
	// 教程方法
	function dfs (root) {
		if (!root || root.val === p.val || root.val === q.val) {
			return root
		}

		const l = dfs(root.left)
		const r = dfs(root.right)

		if (l && r) return root

		return l || r
	}

	// 自己写的
/*	function dg(r, v, stack) {
		if (!r) return false

		// 找到目标值
		if (r.val === v.val) {
			stack.push(r)
			return true
		} else {
			// 继续递归
			if (dg(r.left, v, stack) || dg(r.right, v, stack)) {
				stack.push(r)
				return true
			}
		}
		return false
	}

	// 先找p
	const s1 = []
	dg(root, p, s1)
	// 再找q
	const s2 = []
	dg(root, q, s2)

	for (let i = 0; i < s1.length; i++) {
		for (let j = 0; j < s2.length; j++) {
			if (s2[j].val === s1[i].val) {
				return s1[i]
			}
		}
	}

	return null*/

	return dfs(root)
}

/*console.log(lowestCommonAncestor({
		val: 3,
		left: {
			val: 5,
			left: {val: 6, left: null, right: null},
			right: {
				val: 2,
				left: {
					val: 7, left: null, right: null
				},
				right: {
					val: 4,
					left: null,
					right: null
				}
			}
		},
		right: {
			val: 1,
			left: {val: 0, left: null, right: null},
			right: {val: 8, left: null, right: null}
		}
	},
	{
		val: 4,
		left: null,
		right: null
	},
	{val: 8, left: null, right: null}
))*/


// 寻找两个正序数组的中位数 https://leetcode-cn.com/problems/median-of-two-sorted-arrays/
/*
* 二分法找基准值
* 基本是看教程的，这个不算做出来了
* 我的思路是三指针插值的思路
* */
function findMedianSortedArrays (nums1, nums2) {
	// 保证nums1 长度小于 nums2
	if (nums1.length > nums2.length) {
		[nums1, nums2] = [nums2, nums1]
	}

	const l1 = nums1.length
	const l2 = nums2.length
	const l = l1 + l2

	let slice1 = 0
	let slice2 = 0
	let slice1l = 0
	let slice1r = l1

	/*
	    L1 <= R1
		L1 <= R2
		L2 <= R1
		L2 <= R2
	* */
	while (slice1 <= l1) {
		slice1 = Math.floor((slice1r - slice1l) / 2) + slice1l
		slice2 = Math.floor(l / 2) - slice1
		const L1 = (slice1 === 0) ? -Infinity : nums1[slice1 - 1]
		const L2 = (slice2 === 0) ? -Infinity : nums2[slice2 - 1]
		const R1 = (slice1 === l1) ? Infinity : nums1[slice1]
		const R2 = (slice2 === l2) ? Infinity : nums2[slice2]

		// 处理L1>R2的错误情况
		if(L1 > R2) {
			// 将slice1R左移，进而使slice1对应的值变小
			slice1r = slice1 - 1
		} else if(L2 > R1) {
			// 反之将slice1L右移，进而使slice1对应的值变大
			slice1l = slice1 + 1
		} else {
			// 如果已经符合取中位数的条件（L1<R2&&L2<R1)，则直接取中位数
			if(l % 2 === 0) {
				const L = L1 > L2 ? L1 : L2
				const R = R1 < R2 ? R1 : R2
				return  (L + R) / 2
			} else {
				return (R1 < R2) ? R1 : R2
			}
		}
	}

	return -1
}
// console.log(findMedianSortedArrays([1, 2], [3, 4]))


// 粉刷房子 https://www.lintcode.com/problem/paint-house/description
// 动态规划 + 滚动数组
// 状态转移方程 f[0][x] = Math.min(f[0][x以外的索引1号], f[0][x以外的索引2号]) + costs[i][x]
function minCost (costs) {
	if (costs.length === 0) return 0

	let dp = costs[0]

	for (let i = 1; i < costs.length; i++) {
		const a = Math.min(costs[i][0] + dp[1], costs[i][0] + dp[2])
		const b = Math.min(costs[i][1] + dp[0], costs[i][1] + dp[2])
		const c = Math.min(costs[i][2] + dp[1], costs[i][2] + dp[0])

		dp = [a, b, c]
	}

	return Math.min(...dp)
}
console.log(minCost([]))
