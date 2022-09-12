### 链接
https://leetcode.cn/problems/minimum-time-to-type-word-using-special-typewriter/

### 题解
将a-z转化为数字，每次操作取两数相减的绝对值，再拿(26 - 绝对值)和(绝对值)的最小值，然后加1秒的键入时间，即为返回值
