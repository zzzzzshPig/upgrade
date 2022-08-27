### 链接
https://leetcode.cn/problems/cells-in-a-range-on-an-excel-sheet/

### 题解
题目比较简单，只需要双重循环打印出从c1开始的r1至r2，一直到c2结束.

通过固定的索引`ABCDEFGHIJKLMNOPQRSTUVWXYZ`，可以移除掉`String.fromCharCode()`
