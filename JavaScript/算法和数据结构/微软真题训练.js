// 最长回文子串 https://leetcode-cn.com/problems/longest-palindromic-substring/
function longestPalindrome (s) {
	const dp = []
	for (let i = 0; i < s.length; i++) {
		dp.push([])
		dp[i][i] = 1
	}
	let start = 0
	let end = 0
	for(let i = 0; i < s.length - 1; i++){
		if(s[i] === s[i + 1]) {
			dp[i][i + 1] = 1
			start = i
			end = i + 1
		}
	}

	let sub_len = 3

	while (sub_len <= s.length) {
		for (let i = 0; i <= s.length - sub_len; i++) {
			let j = i + sub_len - 1

			if (dp[i + 1][j - 1] && s[i] === s[j]) {
				dp[i][j] = 1
				start = i
				end = j
			}
		}
		sub_len++
	}

	return s.substring(start, end + 1)
}
/*console.log(longestPalindrome('a'))*/

function TreeNode(val) {
    this.val = val
    this.left = this.right = null
}

// 从前序与中序遍历序列构造二叉树 https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
/*
    3
   / \
  9  20
    /  \
   15   7
* */
// 按照preorder的顺序依次找inorder中的值
// 找3，index为1，index左侧是左节点，右侧是右节点（如上图）。然后再找左节点的子节点和右节点的子节点（先左后右，先序遍历的顺序）
// 找9，index为0，此时寻找的范围是[0, 1).这是左节点的范围。继续找子节点，此时范围是[0, 0)，不会进入循环， 返回null
// 找20，index为3，此时寻找的范围是[2, 5).这是右节点的范围。然后再找左节点的子节点和右节点的子节点
// 找15，index为2，此时寻找的范围是[2, 3).这是左节点的范围。继续找子节点，此时范围是[2, 2)，不会进入循环， 返回null
// 找7，index为4，此时寻找的范围是[4, 5).这是右节点的范围。继续找子节点，此时范围是[4, 4)，不会进入循环， 返回null
// 返回生成的节点
function buildTree (preorder, inorder) {
	let n = 0

	function dg (start, end) {
		// 在 inorder 中找 preorder[n]
		for (let i = start; i < end; i++) {
			if (inorder[i] === preorder[n]) {
				const node = new TreeNode(preorder[n++])
				node.left = dg(start, i)
				node.right = dg(i + 1, end)
				return node
			}
		}

		return null
	}

	return dg(0, preorder.length)
}
// console.log(buildTree([3,9,20,15,7], [9,3,15,20,7]))

// 从中序与后序遍历序列构造二叉树 https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/
// 这道题和上一道题类似，只不过是倒着找
function buildTree2 (inorder, postorder) {
	let n = postorder.length - 1

	function dg (start, end) {
		// 在 inorder 中找 postorder[n]
		for (let i = end - 1; i >= start; i--) {
			if (inorder[i] === postorder[n]) {
				const node = new TreeNode(postorder[n--])
				// 先right 再left
				node.right = dg(i + 1, end)
				node.left = dg(start, i)
				return node
			}
		}

		return null
	}

	return dg(0, postorder.length)
}
// console.log(buildTree([9,3,15,20,7], [9,15,7,20,3]))


// Definition for a Node.
function Node(val, next, random) {
 this.val = val;
 this.next = next;
 this.random = random;
}
function copyRandomList (head) {
	const res = {
		next: null
	}
	let res1 = res
	let queue = []

	while (head) {
		res1 = res1.next = new Node(head.val, head.next ? {} : null, head.random)
		queue.push([head, res1])
		head = head.next
	}

	// 处理random
	res1 = res.next
	while (res1) {
		let i = 0
		for (i; i < queue.length; i++) {
			if (queue[i][0] === res1.random) {
				res1.random = queue[i][1]
				break
			}
		}
		res1 = res1.next
	}
	return res.next
}
