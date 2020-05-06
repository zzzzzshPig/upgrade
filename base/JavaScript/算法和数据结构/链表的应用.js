const utils = require('util')

/*
* 真题描述：将两个有序链表合并为一个新的有序链表并返回。新链表是通过拼接给定的两个链表的所有结点组成的。
* 示例： 输入：1->2->4, 1->3->4 输出：1->1->2->3->4->4
* */
function mergeTwoLists (l, r) {
    let res = {}

    // 可以继续合并
    if (l && r) {
        res.val = Math.min(l.val, r.val)
        res.next = mergeTwoLists(...(res.val === l.val ? [l.next, r] : [r.next, l]))
    } else {
        res = l || r
    }

    return res
}

/* console.log(utils.inspect(mergeTwoLists(
    {
        val: 1,
        next: {
            val: 2,
            next: {
                val: 4,
                next: null
            }
        }
    },
    {
        val: 5,
        next: {
            val: 6,
            next: {
                val: 7,
                next: null
            }
        }
    }
), { showHidden: false, depth: null })) */

/*
* 真题描述：给定一个排序链表，删除所有重复的元素，使得每个元素只出现一次。
* 示例 1:
    输入: 1->1->2
    输出: 1->2
    示例 2:
    输入: 1->1->2->3->3
    输出: 1->2->3
* */
function deleteDuplicates (l) {
    if (!l) return l
    let r = l

    while (r.next) {
        if (r.val === r.next.val) {
            r.next = r.next.next
        } else {
            r = r.next
        }
    }

    return l
}
/* console.log(utils.inspect(deleteDuplicates(
    {
        val: 1,
        next: {
            val: 2,
            next: null
        }
    }
), { showHidden: false, depth: null })) */

/*
* 真题描述：给定一个排序链表，删除所有含有重复数字的结点，只保留原始链表中 没有重复出现的数字。
* 示例 1:
    输入: 1->2->3->3->4->4->5
    输出: 1->2->5
    示例 2:
    输入: 1->1->1->2->3
    输出: 2->3
* */
function deleteDuplicates2 (l) {
    if (!l) return l

    l = {
        val: null,
        next: l
    }
    let r = l
    let i = 0
    let prev = {}

    while (r.next) {
        if (r.val === r.next.val) {
            i++
            r.next = r.next.next
        } else {
            if (i !== 0) {
                r.val = r.next.val
                r.next = r.next.next
            } else {
                prev = r
                r = r.next
            }

            i = 0
        }
    }

    if (i !== 0) {
        prev.next = null
    }

    return l.next
}
console.log(utils.inspect(deleteDuplicates2(
    {
        val: 1,
        next: {
            val: 1,
            next: {
                val: 2,
                next: null
            }
        }
    }
), { showHidden: false, depth: null }))
