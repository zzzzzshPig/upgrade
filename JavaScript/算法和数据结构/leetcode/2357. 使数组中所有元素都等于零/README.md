### 链接
https://leetcode.cn/problems/make-array-zero-by-subtracting-equal-amounts/

### 题解
返回去重之后的正整数数量即可。

当nums中全为[1,1,1,1,1]时，只需要全部减去1即可

当nums中为[1,2,3,4,5]时，则每个数都需要重复减1才可以

所以，重复的数减去相同的值只需要算1次即可。不重复的数减去相同的重复值则需要计算不重复的数的个数。
