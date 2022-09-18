### 链接
https://leetcode.cn/problems/intersection-of-multiple-arrays/

### 题解
根据题意得二维数组总共最多就1000个数，直接遍历然后用哈希记录下，判断记录后的值是否等于 nums.length, 用res记录这些等于的key，最后升序返回即可
