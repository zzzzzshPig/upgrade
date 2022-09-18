### 链接
https://leetcode.cn/problems/convert-1d-array-into-2d-array/

### 题解
if m * n !== original.length

返回空数组

else 遍历 original

生成 res.length = m, res[0].length = n的数组

返回 res
