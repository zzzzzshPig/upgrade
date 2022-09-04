### 链接
https://leetcode.cn/problems/decode-the-message/

### 题解
使用map记录key中出现的字母，依次映射至abcdefg...，出现过的不记录，。
注意空格需要保留，直接记录在map中即可{" ": " "}
