// 岛屿数量 https://leetcode-cn.com/problems/number-of-islands/
/**
 * @param {character[][]} grid
 * @return {number}
 */
/*
* 解析：一道典型的递归题目，使用DFS
* 因为是水平和垂直方向，所以递归向右和下遍历
* 对于处理过的1 可以设置为0
* 因为不相同的岛屿一定没有重复的部分，也就是说设置一个岛屿的1不会影响到另一个岛屿，设置为0可以防止对一个岛屿重复计算
* 因为处理过的岛屿已经设置为0了，所以对左或上的判断如果有1就证明岛屿还有连接部分未处理，递归向左或上
* */
function numIslands (grid) {
	let res = 0

	function dg (i, j) {
		if (grid[i] && grid[i][j] === '1') {
			grid[i][j] = '0'

			dg(i + 1, j)
			dg(i, j + 1)

			// 如果左侧是1 则向左走
			// 如果上面是1 则向上走
			if (grid[i][j - 1] === '1') {
				dg(i, j - 1)
			}
			if (grid[i - 1] && grid[i - 1][j] === '1') {
				dg(i - 1, j)
			}
		}
	}

	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			if (grid[i][j] === '1') {
				dg(i, j)
				res++
			}
		}
	}
	return res
}
/*console.log(numIslands([
	['1','1','0','0','0'],
	['1','1','0','0','0'],
	['0','0','1','0','0'],
	['0','0','0','1','1']
]))*/

// 合并区间 https://leetcode-cn.com/problems/merge-intervals/
/*
* 对数组进行排序，第一个元素小的在前面，这样的话处理过的元素就不需要再次比较了
* 循环遍历 从0开始 后续元素的头部小于当前元素的尾部 即在一个区间
* */
function merge (intervals) {
	intervals.sort((a, b) => a[0] - b[0])

	let res = []
	let i = 1
	let j = 0
	while (i <= intervals.length) {
		j = i - 1
		for (i; i < intervals.length; i++) {
			// 尾部大于头部
			if (intervals[j][1] >= intervals[i][0]) {
				// 扩展区间
				intervals[j][1] = Math.max(intervals[i][1], intervals[j][1])
			} else {
				break
			}
		}
		res.push(intervals[j])
		i++
	}

	return res
}
console.log(merge([[2,3],[2,2],[3,3],[1,3],[5,7],[2,2],[4,6]]))
