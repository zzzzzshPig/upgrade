### 链接
https://leetcode.cn/problems/reverse-prefix-of-word/

### 题解
遍历word直至找到ch，使用s变量保存[ch, 0]的字符 + [ch, word.length - 1]
最后返回s
