const utils = require('../utils')

// 相同的树 https://leetcode-cn.com/problems/same-tree/
function isSameTree (p, q) {
	if (p === null && q === null) {
		return true
	} else if (p === null || q === null){
		return false
	}

	return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
}
// console.log(isSameTree(utils.generateTree([]), utils.generateTree([])))


// 对称二叉树 https://leetcode-cn.com/problems/symmetric-tree/
function isSymmetric (root) {
	let nodes = [root]
	while (nodes.length) {
		const n = []
		const len = nodes.length
		for (let i = 0; i < len; i++) {
			if (nodes[i]) {
				n.push(nodes[i].left, nodes[i].right)
			}
		}

		// diff
		let end = n.length
		let start = 0
		while (start < end) {
			end--

			if (!(n[start] === n[end])) {
				if (n[start] === null || n[end] === null) return false

				if (n[start].val !== n[end].val) return false
			}

			start++
		}
		nodes = n
	}

	return true
}
// console.log(isSymmetric(utils.generateTree([1,2,2,null,3,null,3])))

// 二叉搜索树的范围和 https://leetcode-cn.com/problems/range-sum-of-bst/
function rangeSumBST (root, L, R) {
	let res = 0
	dg(root)

	function dg (node) {
		if (!node) return

		if (node.val >= L && node.val <= R) {
			res += node.val
			dg(node.left)
			dg(node.right)
		} else if (node.val <= L) {
			dg(node.right)
		} else if (node.val >= R) {
			dg(node.left)
		}
	}

	return res
}

// 合并二叉树 https://leetcode-cn.com/problems/merge-two-binary-trees/
function mergeTrees (t1, t2) {
	if (t1 === null) {
		return t2
	}

	if (t2 === null) {
		return t1
	}

	t1.val += t2.val

	t1.left = mergeTrees(t1.left, t2.left)
	t1.right = mergeTrees(t1.right, t2.right)

	return t1
}

// 二叉搜索树中的搜索 https://leetcode-cn.com/problems/search-in-a-binary-search-tree/
function searchBST (root, val) {
	return dg(root)

	function dg (node) {
		if (!node) return null

		if (node.val === val) {
			return node
		} else if (node.val > val) {
			return dg(node.left)
		} else if (node.val < val) {
			return dg(node.right)
		}
	}
}
console.log(searchBST({
	val: 4,
	left: {
		val: 2,
		left: {
			val: 1,
			left: null,
			right: null
		},
		right: {
			val: 3,
			left: null,
			right: null
		}
	},
	right: {
		val: 7,
		left: null,
		right: null
	}
}, 2))

