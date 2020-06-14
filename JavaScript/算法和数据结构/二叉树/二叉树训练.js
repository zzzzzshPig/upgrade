const utils = require('../utils')

// https://leetcode-cn.com/problems/same-tree/
// 相同的树
// 给定两个二叉树，编写一个函数来检验它们是否相同。
// 如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的。
/*
输入:       1         1
          / \       / \
         2   3     2   3

        [1,2,3],   [1,2,3]

输出: true
* */

function isSameTree (p, q) {
	if (p === null && q === null) {
		return true
	} else if (p === null || q === null){
		return false
	}

	return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
}
// console.log(isSameTree(utils.generateTree([]), utils.generateTree([])))


// https://leetcode-cn.com/problems/symmetric-tree/
// 对称二叉树
// 给定一个二叉树，检查它是否是镜像对称的。
//     1
//    / \
//   2   2
//  / \ / \
// 3  4 4  3

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
console.log(isSymmetric(utils.generateTree([1,2,2,null,3,null,3])))
