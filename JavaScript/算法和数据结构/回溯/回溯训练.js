// N皇后 https://leetcode-cn.com/problems/n-queens/
function solveNQueens (n) {
    const res = []

    // q 需要检查的数组
    // row,col 当前皇后插入的位置
    function isValid (q, row, col) {
        let i
        // 上有木有皇后
        for (i = row - 1; i >= 0; i--) {
            if (q[i][col] === 'Q') {
                return false
            }
        }

        // 左上
        let col1 = col - 1
        for (i = row - 1; i >= 0 && col1 >= 0; i--) {
            if (q[i][col1] === 'Q') {
                return false
            }
            col1--
        }

        // 右上
        col1 = col + 1
        for (i = row - 1; i >= 0 && col1 < n; i--) {
            if (q[i][col1] === 'Q') {
                return false
            }
            col1++
        }

        return true
    }

    dg([], 0)
    function dg (q, row) {
        // break
        if (row === n) {
            res.push(q)
            return
        }

        // 当前row的每个col都有可能是Q
        for (let i = 0; i < n; i++) {
            if (isValid(q, row, i)) {
                dg(q.concat(`${'.'.repeat(i)}Q${'.'.repeat(n - i - 1)}`), row + 1)
            }
        }
    }

    return res
}
// console.log(solveNQueens(9))

// N皇后 II https://leetcode-cn.com/problems/n-queens-ii/submissions/
function totalNQueens (n) {
    let res = 0

    // q 需要检查的数组
    // row,col 当前皇后插入的位置
    function isValid (q, row, col) {
        let i
        // 上有木有皇后
        for (i = row - 1; i >= 0; i--) {
            if (q[i] === col) {
                return false
            }
        }

        // 左上
        let col1 = col - 1
        for (i = row - 1; i >= 0 && col1 >= 0; i--) {
            if (q[i] === col1) {
                return false
            }
            col1--
        }

        // 右上
        col1 = col + 1
        for (i = row - 1; i >= 0 && col1 < n; i--) {
            if (q[i] === col1) {
                return false
            }
            col1++
        }

        return true
    }

    dg([], 0)
    function dg (q, row) {
        // break
        if (row === n) {
            res++
            return
        }

        // 当前row的每个col都有可能是Q
        for (let i = 0; i < n; i++) {
            if (isValid(q, row, i)) {
                dg(q.concat(i), row + 1)
            }
        }
    }

    return res
}

// 二进制手表 https://leetcode-cn.com/problems/binary-watch/
// 这道题还有O(1)解法，我是没有想到的，参考 https://leetcode-cn.com/problems/binary-watch/comments/
function readBinaryWatch (num) {
    const res = []
    const light = [1, 2, 4, 8, 1, 2, 4, 8, 16, 32]

    function addHour (time, h) {
        const t = time.concat()
        t[0] += h
        return t
    }

    function addMinute (time, m) {
        const t = time.concat()
        t[1] += m
        return t
    }

    function isValid (time) {
        return time[0] <= 11 && time[1] <= 59
    }

    // time = [hour, minute]
    function dg (time, index, row) {
        // break
        if (row === num) {
            time[1] < 10 && (time[1] = '0' + time[1])
            res.push(time.join(':'))
            return
        }

        // 当前生成的是小时
        for (index; index < 4; index++) {
            const t = addHour(time, light[index])
            if (isValid(t)) {
                dg(t, index + 1,  row + 1)
            }
        }

        // 当前生成的是分钟
        for (index; index < 10; index++) {
            const t = addMinute(time, light[index])
            if (isValid(t)) {
                dg(t, index + 1, row + 1)
            }
        }
    }

    dg([0, 0], 0, 0)
    return res
}
// console.log(readBinaryWatch(4))

// 无重复字符串的排列组合 https://leetcode-cn.com/problems/permutation-i-lcci/
function permutation (S) {
    const res = []

    function dg (select, remain) {
        // break
        if (remain === '') {
            res.push(select)
            return
        }

        for (let i = 0; i < remain.length; i++) {
            dg(select + remain[i], remain.slice(0, i) + remain.slice(i + 1))
        }
    }

    dg('', S)
    return res
}
// console.log(permutation('qwert'))

// 括号 https://leetcode-cn.com/problems/bracket-lcci/
function generateParenthesis (n) {
    const res = []

    function dg (left, right, str) {
        // break
        if (left === right && right === n) {
            res.push(str)
            return
        }

        if (left === right) {
            dg(left + 1, right, str + '(')
        } else if (left > right) {
            if (left < n) dg(left + 1, right, str + '(')
            dg(left, right + 1, str + ')')
        }
    }

    dg(0, 0, '')
    return res
}
// console.log(generateParenthesis(6))

// 幂集 https://leetcode-cn.com/problems/power-set-lcci/
function subsets (nums) {
    const res = []

    function dg(arr, i) {
        res.push(arr)
        for (i; i < nums.length; i++) {
            dg(arr.concat(nums[i]), i + 1)
        }
    }
    dg([], 0)
    return res
}

// 有重复字符串的排列组合 https://leetcode-cn.com/problems/permutation-ii-lcci/ 和 https://leetcode-cn.com/problems/zi-fu-chuan-de-pai-lie-lcof/submissions/
function permutation (S) {
	S = S.split('').sort((a, b) => a.localeCompare(b)).join('')

	const res = []
	const mark = {}

	function dg (n) {
		if (n.length === S.length) {
			res.push(n)
			return
		}

		for (let i = 0; i < S.length; i++) {
			if (mark[i]) continue
			// 这一个最重要 参考 https://leetcode-cn.com/problems/permutations-ii/solution/hui-su-suan-fa-python-dai-ma-java-dai-ma-by-liwe-2/
			if (i > 0 && S[i] === S[i - 1] && mark[i - 1]) continue

			mark[i] = true

			dg(n + S[i])

			mark[i] = false
		}
	}

	dg('')
	return res
}
// console.log(permutation('qqe'))

// 长度为 n 的开心字符串中字典序第 k 小的字符串 https://leetcode-cn.com/problems/the-k-th-lexicographical-string-of-all-happy-strings-of-length-n/
function getHappyString (n, k) {
	let res = ''
	const rule = ['a', 'b', 'c']

	function dg (s) {
		if (s.length === n || res) {
			k--

			if (k === 0) {
				res = s
			}
			return
		}

		for (let i = 0; i < rule.length; i++) {
			if (rule[i] !== s[s.length - 1]) {
				dg(s + rule[i])
			}
		}
	}

	dg('')
	return res
}
// console.log(getHappyString(30, 100000000))

// 分割回文串 https://leetcode-cn.com/problems/palindrome-partitioning/
function partition (s) {
	let res = []

	function inValid (str) {
		let left = 0
		let right = str.length - 1

		while (left < right) {
			if (str[left] !== str[right]) return false
			left++
			right--
		}

		return true
	}

	function dg (arr, i) {
		if (i === s.length) {
			res.push(arr.slice(0))
			return
		}

		let str = ''
		for (i; i < s.length; i++) {
			str += s[i]
			if (inValid(str)) {
				arr.push(str)
				dg(arr, i + 1)
				arr.pop()
			}
		}
	}

	dg([], 0)
	return res
}
// console.log(partition('aaaaaaaaa'))

// 组合总和 II https://leetcode-cn.com/problems/combination-sum-ii/
function combinationSum2 (candidates, target) {
	candidates.sort((a, b) => a - b)

	const res = []
	const arr = []

	function dg (index, sum) {
		if (sum >= target) {
			if (sum === target) {
				res.push(arr.slice(0))
			}
			return
		}

		for (let i = index; i < candidates.length; i++) {
			// 1,1,1第三个1 会和第二个1重复 所以需要排除
			// 1,2,2 第二个2和第一个2 也是会重复 也需要排除
			if (i > index && candidates[i] === candidates[i - 1]) continue

			arr.push(candidates[i])
			dg(i + 1, sum + candidates[i])
			arr.pop()
		}
	}
	dg( 0,0)
	return res
}
// console.log(combinationSum2([1,1,1,1,1], 5))

// 优美的排列 https://leetcode-cn.com/problems/beautiful-arrangement/
function countArrangement (N) {
	let res = 0
	let arr = []
	let deep = 1

	function dg () {
		if (deep > N) {
			res++
			return
		}

		for (let i = 1; i <= N; i++) {
			if (arr[i]) continue

			// 是否是优美排列
			if (i % deep === 0 || deep % i === 0) {
				arr[i] = true
				deep++
				dg(1)
				deep--
				arr[i] = false
			}
		}
	}

	dg()
	return res
}
// console.log(countArrangement(15))

// 黄金矿工 https://leetcode-cn.com/problems/path-with-maximum-gold/
// 注释是自己写的，性能上有点问题
// 没有注释的 是参考 https://leetcode-cn.com/submissions/detail/93601601/ 排名第一的人写的
// 思路是一致的，不过快点的少了一部分dg
function getMaximumGold (grid) {
	/*
	* 	let res = 0
	let walk_map = {}

	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			// 从任意一个有黄金的单元格出发
			if (grid[i][j] !== 0) dg(i, j, grid[i][j])
		}
	}

	function dg (i, j, sum) {
		const geo = `${i}${j}`
		if (walk_map[geo]) return

		// 上下左右都能走，给走过的做标记
		walk_map[geo] = true

		// 上
		if (grid[i - 1] && grid[i - 1][j]) dg(i - 1, j, sum + grid[i - 1][j])
		// 右
		if (grid[i][j + 1]) dg(i, j + 1, sum + grid[i][j + 1])
		// 下
		if (grid[i + 1] && grid[i + 1][j]) dg(i + 1, j, sum + grid[i + 1][j])
		// 左
		if (grid[i][j - 1]) dg(i, j - 1, sum + grid[i][j - 1])

		res = Math.max(res, sum)

		walk_map[geo] = false
	}

	return res
	* */

	let res = 0
	const m = grid.length
	const n = grid[0].length
	const used = new Array(m).fill(0).map(() => new Array(n).fill(false));

	for (let i = 0; i < m; i++) {
		for (let j = 0; j < n; j++) {
			// 从任意一个有黄金的单元格出发
			dg(i, j, grid[i][j])
		}
	}

	function dg (i, j, sum) {
		if (grid[i][j] !== 0) {
			// 上下左右都能走，给走过的做标记
			used[i][j] = true

			// 上
			if (i - 1 >= 0 && !used[i - 1][j]) dg(i - 1, j, sum + grid[i - 1][j])
			// 右
			if (j + 1 < n && !used[i][j + 1]) dg(i, j + 1, sum + grid[i][j + 1])
			// 下
			if (i + 1 < m && !used[i + 1][j]) dg(i + 1, j, sum + grid[i + 1][j])
			// 左
			if (j - 1 >= 0 && !used[i][j - 1]) dg(i, j - 1, sum + grid[i][j - 1])

			res = Math.max(res, sum)
			used[i][j] = false
		}
	}

	return res
}
// console.log(getMaximumGold([[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]))

// 子集 II https://leetcode-cn.com/problems/subsets-ii/submissions/
// 思路和组合总和 II 一致
function subsetsWithDup (nums) {
	nums.sort((a, b) => a - b)

	const res = []
	const arr = []

	function dg (index) {
		res.push(arr.slice(0))

		for (let i = index; i < nums.length; i++) {
			// 1,1,1第三个1 会和第二个1重复 所以需要排除
			// 1,2,2 第二个2和第一个2 也是会重复 也需要排除
			if (i > index && nums[i] === nums[i - 1]) continue

			arr.push(nums[i])
			dg(i + 1)
			arr.pop()
		}
	}
	dg(0, 0)
	return res
}
// console.log(subsetsWithDup([1,2,2,1,1,1,11,1,1,1,1,11,1,1,1,1,1,1,1,11,1,1,1]))

// 字母组合迭代器 https://leetcode-cn.com/problems/iterator-for-combination/
function CombinationIterator (characters, combinationLength) {
	this.dp = Array.from({length: combinationLength}).map((a, i) => i)
	this.characters = characters
	this.has = true
}
CombinationIterator.prototype.next = function() {
	let res = ''
	for (let i = 0; i < this.dp.length; i++) {
		res += this.characters[this.dp[i]]
	}

	// 更新dp
	let j = this.characters.length - 1
	let i = this.dp.length - 1

	// 向前寻值
	while (this.dp[i] === j) {
		i--
		j--
	}

	if (i < 0) {
		this.has = false
	} else {
		let v = this.dp[i]
		for (i; i < this.dp.length; i++) {
			v++
			this.dp[i] = v
		}
	}

	return res
}
CombinationIterator.prototype.hasNext = function() {
	return this.has
}

// 全排列 II https://leetcode-cn.com/problems/permutations-ii/
function permuteUnique (nums) {
	nums.sort((a, b) => a - b)

	const res = []
	const mark = {}

	function dg (n) {
		if (n.length === nums.length) {
			res.push(n.slice(0))
			return
		}

		for (let i = 0; i < nums.length; i++) {
			if (mark[i]) continue
			// 这一个最重要 参考 https://leetcode-cn.com/problems/permutations-ii/solution/hui-su-suan-fa-python-dai-ma-java-dai-ma-by-liwe-2/
			if (i > 0 && nums[i] === nums[i - 1] && mark[i - 1]) continue

			mark[i] = true
			n.push(nums[i])

			dg(n)

			mark[i] = false
			n.pop()
		}
	}

	dg([])
	return res
}
// console.log(permuteUnique([1,1,2,2,3,3]))

// 电话号码的字母组合 https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/
function letterCombinations (digits) {
	if (digits.length === 0) return []

	const rule = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz']
	const res = []
	const LEN = digits.length

	function dfs (s, deep) {
		// 终止条件
		if (deep === LEN) {
			res.push(s)
			return
		}

		// 获取当前电话号码对应的字母
		const r = rule[digits[deep]]
		for (let i = 0; i < r.length; i++) {
			// 穷举
			dfs(s + r[i], deep + 1)
		}
	}

	dfs('', 0)
	return res
}

// 计算各个位数不同的数字个数 https://leetcode-cn.com/problems/count-numbers-with-unique-digits/
// 有其他解法更简单，暂时不会
function countNumbersWithUniqueDigits (n) {
	let r = '0123456789'
	let res = 0
	let mark = {}

	function dg (deep) {
		if (deep === n) {
			return
		}

		let i = deep ? 0 : 1
		for (i; i < r.length; i++) {
			if (mark[i]) continue
			res++

			mark[i] = true
			dg(deep + 1)
			mark[i] = false
		}
	}

	dg(0)
	return res + 1
}
// console.log(countNumbersWithUniqueDigits(10))
