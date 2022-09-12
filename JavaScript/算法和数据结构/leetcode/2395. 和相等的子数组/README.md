### 链接
https://leetcode.cn/problems/find-subarrays-with-equal-sum/

### 题解
用哈希表记录从0开始的(i + (i + 1))的数，一旦出现和相同则为true，否则为false
