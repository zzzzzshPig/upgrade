### 链接
https://leetcode.cn/problems/check-distances-between-same-letters/

### 题解
模拟

1. 用数组记录每一个字母的间隔得到数组A
2. 遍历distance对比A和distance的值
3. 如果A中的值为undefined，则忽略
4. 如果A中的数字和distance中对应的值相等，则返回true
5. 不相等则返回false
