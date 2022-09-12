### 链接
https://leetcode.cn/problems/convert-a-number-to-hexadecimal/

### 题解
补码，假设mod为12, (3, 9)(2,10)(4,8)为相互补码

题中，mod为2 ** 32次方，所以负整数的补码为2 ** 32 + x

循环除16直到num < 16，每次的除数为新的位，最后的余数为最后一位
