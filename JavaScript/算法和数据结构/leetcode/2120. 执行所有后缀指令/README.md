### 链接
https://leetcode-cn.com/problems/execution-of-all-suffix-instructions-staying-in-a-grid/

### 题解
模拟解法，模拟机器人的每一步操作，根据规则判断是否停止操作即可。

每次从第`i`个开始循环，每步按规定操作进行，一旦达到停止条件则记录 `j - i` 的值，最后返回answers数组。
