const utils = require('util')
/*
真题描述：给定一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
示例： 给定一个链表: 1->2->3->4->5, 和 n = 2.
当删除了倒数第二个结点后，链表变为 1->2->3->5.
说明： 给定的 n 保证是有效的。
* */

function removeNthFromEnd (head, n) {
    const dummy = {
        val: null,
        next: head
    }
    let fast = dummy
    let slow = dummy
    let i = 0

    while (fast.next) {
        // 快指针一直在动
        fast = fast.next

        // 慢指针开始动
        if (i >= n) {
            slow = slow.next
        }

        i++
    }

    slow.next = slow.next.next

    return dummy.next
}
/* console.log(utils.inspect(removeNthFromEnd(
    {
        val: 1,
        next: null
    }, 1
), { showHidden: false, depth: null })) */

function reverseList (head) {
    let cur = head
    let pre = null

    while (cur) {
        const next = cur.next

        cur.next = pre

        pre = cur

        cur = next
    }

    return pre
}
/* console.log(utils.inspect(reverseList(
    {
        val: 1,
        next: {
            val: 2,
            next: {
                val: 3,
                next: {
                    val: 4,
                    next: {
                        val: 5,
                        next: null
                    }
                }
            }
        }
    }, 1
), { showHidden: false, depth: null })) */

/*
真题描述：反转从位置 m 到 n 的链表。请使用一趟扫描完成反转。
说明: 1 ≤ m ≤ n ≤ 链表长度。
示例:
输入: 1->2->3->4->5->NULL, m = 2, n = 4
输出: 1->4->3->2->5->NULL
* */
function reverseBetween (head, m, n) {
    const dummy = {
        val: null,
        next: head
    }
    let i = 1
    let mNode = dummy

    // 确定左边
    while (i < m) {
        mNode = mNode.next
        i++
    }

    let cur = mNode.next
    let pre = null
    while (i <= n) {
        const next = cur.next

        cur.next = pre

        pre = cur

        cur = next

        i++
    }

    mNode.next.next = cur
    mNode.next = pre
    return dummy.next
}
console.log(utils.inspect(reverseBetween(
    {
        val: 1,
        next: {
            val: 2,
            next: {
                val: 3,
                next: {
                    val: 4,
                    next: {
                        val: 5,
                        next: null
                    }
                }
            }
        }
    }, 1, 5
), { showHidden: false, depth: null }))
