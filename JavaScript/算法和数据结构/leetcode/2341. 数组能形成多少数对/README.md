### 链接
https://leetcode.cn/problems/maximum-number-of-pairs-in-array/

### 题解
桶排序记录下每个元素出现的次数，遍历桶数组，加上次数%2，最后返回[(nums.length - res) / 2, res]
