### 链接
https://leetcode.cn/problems/count-prefixes-of-a-given-string/

### 题解
一次遍历，当words[i][0]长度大于s时，跳过。
当words[i][0]等于s[0]时，继续对比[1][...][words[i][0].length - 1]，当其中有一个不想等，则跳过。
否则结果值 + 1。
