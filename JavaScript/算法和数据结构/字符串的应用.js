// 反转字符串
// demo 1
function reverseString1 (str) {
    return str.split('').reverse().join('')
}
// console.log(reverseString1('1111111111111111aaaa'))

function reverseString2 (str) {
    let res = ''
    const len = str.length - 1
    for (let i = len; i >= 0; i--) {
        res += str[i]
    }
    return res
}
// console.log(reverseString2('1111111111111111aaaa'))

function isPalindrome (str) {
    return str === reverseString1(str)
}
// console.log(isPalindrome1('12'), isPalindrome1('121'))

/*
真题描述：给定一个非空字符串 s，最多删除一个字符。判断是否能成为回文字符串。
示例 1: 输入: "aba"
输出: True
示例 2:
输入: "abca"
输出: True
解释: 你可以删除c字符。
注意: 字符串只包含从 a-z 的小写字母。字符串的最大长度是50000。
* */
/* function validPalindrome (str) {
    let l = 0
    let r = str.length - 1

    while (l < r && str[l] === str[r]) {
        l++
        r--
    }

    // 如果str本身不是回文字符串 且 删除掉l 和 r后还不是回文字符串则此 str 不是回文字符串
    if (str[l] !== str[r] && !isPalindrome(str.slice(0, l) + str.slice(l + 1)) && !isPalindrome(str.slice(0, r) + str.slice(r + 1))) {
        return false
    }

    return true
}
console.log(validPalindrome('accba')) */

/*
* 真题描述： 设计一个支持以下两种操作的数据结构：
void addWord(word)
bool search(word)
search(word) 可以搜索文字或正则表达式字符串，字符串只包含字母 . 或 a-z 。
. 可以表示任何一个字母。
* 示例:
* addWord("bad")
  addWord("dad")
  addWord("mad")
  search("pad") -> false
  search("bad") -> true
  search(".ad") -> true
  search("b..") -> true
  说明:
  你可以假设所有单词都是由小写字母 a-z 组成的。
* */

/*
* 这里我们以字母长度做为key
* */
/*
class Words {
    words = {}

    addWord (str) {
        if (this.words[str.length]) {
            this.words[str.length].push(str)
        } else {
            this.words[str.length] = [str]
        }
    }

    search (str) {
        const word = this.words[str.length]

        if (!word) return false

        const reg = new RegExp(str)
        let res = false
        for (const w of word) {
            if (reg.test(w)) {
                res = true
                break
            }
        }

        return res
    }
}

const w = new Words()
w.addWord('bad')
w.addWord('dad')
w.addWord('mad')
console.log(
    w.words,
    w.search('pad'),
    w.search('bad'),
    w.search('.ad'),
    w.search('b..')
)
*/

/*
* 真题描述：请你来实现一个 atoi 函数，使其能将字符串转换成整数。
首先，该函数会根据需要丢弃无用的开头空格字符，直到寻找到第一个非空格的字符为止。
当我们寻找到的第一个非空字符为正或者负号时，则将该符号与之后面尽可能多的连续数字组合起来，作为该整数的正负号；假如第一个非空字符是数字，则直接将其与之后连续的数字字符组合起来，形成整数。
该字符串除了有效的整数部分之后也可能会存在多余的字符，这些字符可以被忽略，它们对于函数不应该造成影响。
注意：假如该字符串中的第一个非空格字符不是一个有效整数字符、字符串为空或字符串仅包含空白字符时，则你的函数不需要进行转换。
在任何情况下，若函数不能进行有效的转换时，请返回 0。

* 说明： 假设我们的环境只能存储 32 位大小的有符号整数，那么其数值范围为 [−2^31,  2^31 − 1]。如果数值超过这个范围，请返回  INT_MAX (2^31 − 1) 或 INT_MIN (−2^31) 。

* 示例 1:
输入: "42"
输出: 42

示例 2:
输入: " -42"
输出: -42
解释: 第一个非空白字符为 '-', 它是一个负号。
我们尽可能将负号与后面所有连续出现的数字组合起来，最后得到 -42 。

示例 3: 输入: "4193 with words"
输出: 4193
解释: 转换截止于数字 '3' ，因为它的下一个字符不为数字。

示例 4: 输入: "words and 987"
输出: 0
解释: 第一个非空字符是 'w', 但它不是数字或正、负号。 因此无法执行有效的转换。

示例 5:
输入: "-91283472332"
输出: -2147483648
解释: 数字 "-91283472332" 超过 32 位有符号整数范围。因此返回 INT_MIN (−2^31) 。
* */

function isNumber (s) {
    const code = s.charCodeAt(0)
    return code >= 48 && code <= 57
}

function atoi (str) {
    str = str.trim()
    const isChar = str[0] === '-' || str[0] === '+'

    // 第一个字符 不是数字 也不是 + -
    if (!isNumber(str[0]) && !isChar) return 0

    let res = ''
    // 第一个字符是 + 或 -
    if (isChar) {
        res = str[0]
    }

    // 获取数字部分 如果不是数字 后面部分截掉
    for (let i = isChar ? 1 : 0; i < str.length; i++) {
        if (isNumber(str[i])) {
            res += str[i]
        } else {
            break
        }
    }

    const max = Math.pow(2, 31) - 1
    const min = -max - 1
    res = Number(res)

    return Math.min(max, Math.max(min, res))
}
console.log(
    atoi('42'),
    atoi('+42'),
    atoi('-42'),
    atoi('4193 with words'),
    atoi('words and 987'),
    atoi('-91283472332'),
    atoi('91283472332')
)
