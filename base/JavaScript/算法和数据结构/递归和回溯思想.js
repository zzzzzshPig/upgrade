/*
题目描述：给定一个没有重复数字的序列，返回其所有可能的全排列。
示例：
输入: [1,2,3]
输出: [
 [1,2,3],
 [1,3,2],
 [2,1,3],
 [2,3,1],
 [3,1,2],
 [3,2,1]
]
* */

function permute (nums) {
    const res = []
    const mark = {}

    function dg (n) {
        if (n.length === nums.length) {
            res.push(n.concat([]))
            return
        }

        for (let i = 0; i < nums.length; i++) {
            if (!mark[nums[i]]) {
                mark[nums[i]] = true
                n.push(nums[i])

                dg(n)

                mark[nums[i]] = false
                n.pop()
            }
        }
    }

    dg([])
    return res
}

// console.log(permute([1, 2, 3]))

/*
给定一组不含重复元素的整数数组 nums，返回该数组所有可能的子集（幂集）。
说明：解集不能包含重复的子集。
输入: nums = [1,2,3]
输出:
[
  [3],
  [1],
  [2],
  [1,2,3],
  [1,3],
  [2,3],
  [1,2],
  []
]
* */
function subsets (nums) {
    const res = []

    // 因为不能包含重复子集，所以每次循环都是递增 不需要循环全部
    function dg (n, i) {
        if (i === nums.length) {
            res.push(n.concat([]))
            return
        }

        // 不取
        dg(n, i + 1)

        // 取
        n.push(nums[i])
        dg(n, i + 1)
        n.pop()
    }

    dg([], 0)
    return res
}

/* console.log(subsets([1, 2, 3])) */

/*
给定两个整数 n 和 k，返回 1 ... n 中所有可能的 k 个数的组合。
输入: n = 4, k = 2
输出:
[
  [2,4],
  [3,4],
  [2,3],
  [1,2],
  [1,3],
  [1,4],
]
* */
function combine (n, k) {
    const res = []
    const path = []

    function dg (i) {
        // 剪枝
        if (path.length === k) {
            res.push(path.concat([]))
            return
        }

        for (i; i <= n; i++) {
            path.push(i)
            dg(i + 1)
            path.pop()
        }
    }

    dg(1)
    return res
}
console.log(combine(4, 2))
