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
// console.log(searchBST({
// 	val: 4,
// 	left: {
// 		val: 2,
// 		left: {
// 			val: 1,
// 			left: null,
// 			right: null
// 		},
// 		right: {
// 			val: 3,
// 			left: null,
// 			right: null
// 		}
// 	},
// 	right: {
// 		val: 7,
// 		left: null,
// 		right: null
// 	}
// }, 2))

// 二叉树的最大深度 https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/
function maxDepth (root) {
	function dg (node) {
		if (!node) return 0

		return Math.max(dg(node.left), dg(node.right)) + 1
	}

	return dg(root)
}

// 二叉树的最小深度 https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/
function minDepth (root) {
	function dg (node) {
		if (!node) return 0

		const left = dg(node.left)
		const right = dg(node.right)

		if (left === 0) {
			return right + 1
		} else if (right === 0) {
			return left + 1
		} else {
			return Math.min(left, right) + 1
		}
	}

	return dg(root)
}

// N叉树的后序遍历 https://leetcode-cn.com/problems/n-ary-tree-postorder-traversal/
function postorder (root) {
	const res = []

	dg(root)
	function dg (node) {
		if (!node) return

		for (let j = 0; j < node.children.length; j++) {
			dg(node.children[j])
		}

		res.push(node.val)
	}

	return res
}

// N叉树的前序遍历 https://leetcode-cn.com/problems/n-ary-tree-postorder-traversal/
function postorder (root) {
	const res = []

	dg(root)
	function dg (node) {
		if (!node) return

		res.push(node.val)

		for (let j = 0; j < node.children.length; j++) {
			dg(node.children[j])
		}
	}

	return res
}

// 递增顺序查找树 https://leetcode-cn.com/problems/increasing-order-search-tree/
function increasingBST (root) {
	let res = new TreeNode()
	let cur = res

	dg(root)
	function dg (node) {
		if (!node) return

		dg(node.left)

		node.left = null
		cur.right = node
		cur = node

		dg(node.right)
	}
	return res.right
}

// N叉树的最大深度 https://leetcode-cn.com/problems/maximum-depth-of-n-ary-tree/
function maxDepth (root) {
	if (!root) return 0

	let v = []
	for (let i = 0; i < root.children.length; i++) {
		v.push(maxDepth(root.children[i]))
	}
	return (v.length ? Math.max(...v) : 0) + 1
}

// 单值二叉树 https://leetcode-cn.com/problems/univalued-binary-tree/
function isUnivalTree (root) {
	const val = root.val

	return dg(root)
	function dg (root) {
		if (!root) return true
		if (root.val !== val) return false

		return dg(root.left) && dg(root.right)
	}
}

// 修剪二叉搜索树 https://leetcode-cn.com/problems/trim-a-binary-search-tree/
function trimBST (root, L, R) {
	if (!root) return null

	if (root.val < L) {
		root = trimBST(root.right, L ,R)
	} else if (root.val > R) {
		root = trimBST(root.left, L ,R)
	} else {
		if (root.val > L) {
			root.left = trimBST(root.left, L, R)
		} else {
			root.left = null
		}

		if (root.val < R) {
			root.right = trimBST(root.right, L, R)
		} else {
			root.right = null
		}
	}

	return root
}

// 二叉树的层次遍历 II https://leetcode-cn.com/problems/binary-tree-level-order-traversal-ii/
// 标准的bfs
function levelOrderBottom (root) {
	if (!root) return []

	let bfs = [root]
	const res = []

	while (bfs.length) {
		const b = []
		const r = []
		res.unshift(r)

		for (let i = 0; i < bfs.length; i++) {
			let bfs_i = bfs[i]

			r.push(bfs_i.val)
			if (bfs_i.left) b.push(bfs_i.left)
			if (bfs_i.right) b.push(bfs_i.right)
		}

		bfs = b
	}

	return res
}

// 二叉树的层平均值 https://leetcode-cn.com/problems/average-of-levels-in-binary-tree/
// bfs
function averageOfLevels (root) {
	if (!root) return []

	let bfs = [root]
	const res = []

	while (bfs.length) {
		const b = []
		let r = 0
		let r1 = 0 // 平均数

		for (let i = 0; i < bfs.length; i++) {
			let bfs_i = bfs[i]

			r += bfs_i.val
			r1 = r / (i + 1)
			if (bfs_i.left) b.push(bfs_i.left)
			if (bfs_i.right) b.push(bfs_i.right)
		}

		res.push(r1)
		bfs = b
	}

	return res
}

// 二叉搜索树的最近公共祖先 https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-search-tree/
// 不满足 root.val < L || root.val > R 则代表 p q节点分别在root的左右两侧 所以直接返回root即可
function lowestCommonAncestor (root, p, q) {
	let L = p.val
	let R = q.val
	if (L > R) {
		[L, R] = [R, L]
	}

	function dg (root) {
		if (!root) return root

		if (root.val < L) {
			return dg(root.right)
		} else if (root.val > R) {
			return dg(root.left)
		} else {
			return root
		}
	}

	return dg(root)
}

// 二叉树的所有路径 https://leetcode-cn.com/problems/binary-tree-paths/
function binaryTreePaths (root) {
	if (!root) return []

	let res = []

	function dg (root, path) {
		path += root.val

		if (root.left === null && root.right === null) {
			res.push(path)
		}

		if (root.left) {
			dg(root.left, path + '->')
		}

		if (root.right) {
			dg(root.right, path + '->')
		}
	}

	dg(root, '')
	return res
}

// 从根到叶的二进制数之和 https://leetcode-cn.com/problems/sum-of-root-to-leaf-binary-numbers/
function sumRootToLeaf (root) {
	if (!root) return 0

	let res = 0

	function dg (root, val) {
		val *= 2
		val += root.val

		if (root.left === null && root.right === null) {
			res += val
		}

		if (root.left) {
			dg(root.left, val)
		}

		if (root.right) {
			dg(root.right, val)
		}
	}

	dg(root, '')
	return res
}

// 叶子相似的树 https://leetcode-cn.com/problems/leaf-similar-trees/
function leafSimilar (root1, root2) {
	let res1 = dg(root1)
	let res2 = dg(root2)
	function dg (root) {
		if (!root) return root

		let left = dg(root.left)
		let right = dg(root.right)

		if (left === null && right === null) return root.val + ','
		if (left === null) return right
		if (right === null) return left
		return left + right
	}

	return res1 === res2
}

// 把二叉搜索树转换为累加树 https://leetcode-cn.com/problems/convert-bst-to-greater-tree/
// 反中序遍历
function convertBST (root) {
	if (!root) return root

	let res = 0
	dg(root)

	function dg (root) {
		if (root.right !== null) {
			dg(root.right)
		}
		res += root.val
		root.val = res

		if (root.left !== null) {
			dg(root.left)
		}
		return root
	}

	return root
}

// 二叉搜索树的最小绝对差 https://leetcode-cn.com/problems/minimum-absolute-difference-in-bst/
// 中序遍历
function getMinimumDifference (root) {
	let res = null
	let last = null

	dg(root)
	function dg (root) {
		if (root.left) {
			dg(root.left)
		}

		if (res === 1) {
			return res
		} else if (last === null) {
			last = root.val
		} else {
			res = Math.min(res || Infinity, Math.abs(root.val - last))
			last = root.val
		}

		if (root.right) {
			dg(root.right)
		}
	}

	return res
}

// 两数之和 IV - 输入 BST https://leetcode-cn.com/problems/two-sum-iv-input-is-a-bst/
// 使用遍历 + map
// 时间复杂度 O(n)，空间复杂度 O(n)
function findTarget (root, k) {
	let res = {}

	function dg (root) {
		if (!root) return false

		if (res[k - root.val]) return true
		else res[root.val] = true

		return dg(root.left) || dg(root.right)
	}
	return dg(root)
}

// 二叉树的坡度 https://leetcode-cn.com/problems/binary-tree-tilt/
// 后序遍历
/*
时间复杂度：O(n)，其中 n 是结点的数目。每个结点访问一次。
空间复杂度：O(n)，在最糟糕的情形下，当树倾斜时，树的深度可以达到 n。平均情况下，树的深度为 logn。
* */
function findTilt (root) {
	let res = 0

	function dg (root) {
		if (!root) return 0

		const left = dg(root.left)
		const right = dg(root.right)

		// 所有节点的坡度之和 就是整个树的坡度
		res += Math.abs(right - left)

		return root.val + left + right
	}

	dg(root)
	return res
}

// 左叶子之和 https://leetcode-cn.com/problems/sum-of-left-leaves/
// 后序遍历
// 只用判断当前叶子的左叶子是不是符合左叶子条件 符合条件就累加值
/*
时间复杂度：O(n)
空间复杂度：O(n)
* */
function sumOfLeftLeaves (root) {
	if (!root) return 0

	let res = sumOfLeftLeaves(root.left) + sumOfLeftLeaves(root.right)

	// 左叶子
	if (root.left && root.left.left === null && root.left.right === null) {
		res += root.left.val
	}

	return res
}

// 根据二叉树创建字符串 https://leetcode-cn.com/problems/construct-string-from-binary-tree/
function tree2str (t) {
	if (!t) return ''
	let res = ''

	function dg (root) {
		res += root.val

		if (root.left) {
			res += '('
			dg(root.left)
			res += ')'
		} else {
			if (root.right) res += '()'
		}

		if (root.right) {
			res += '('
			dg(root.right)
			res += ')'
		}
	}
	dg(t)
	return res
}
