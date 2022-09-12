### 链接
https://leetcode.cn/problems/count-common-words-with-one-occurrence/

### 题解
1. 使用哈希表1记录words1中出现的字符串
2. 使用哈希表2记录words2中出现的字符串
3. 遍历哈希表1，使用值为1的key索引哈希表2，如果为1则记录
4. 返回记录值

