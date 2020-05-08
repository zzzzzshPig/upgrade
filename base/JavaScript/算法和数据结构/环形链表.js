const utils = require('util')

/*
* 给定一个链表，判断链表中是否有环。
为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。

输入：head = [3,2,0,-4], pos = 1
输出：true
解释：链表中有一个环，其尾部连接到第二个节点。
* */
function hasCycle (head) {
    if (!head) return false

    let fast = head
    let slow = head

    // 快慢指针
    while (fast && fast.next && slow) {
        fast = fast.next.next
        slow = slow.next

        if (fast === slow) return fast
    }

    return false
}
const last = {
    val: 4,
    next: null
}
const test1 = {
    val: 3,
    next: {
        val: 1,
        next: {
            val: 2,
            next: {
                val: 0,
                next: {
                    val: -4,
                    next: {
                        val: 1,
                        next: {
                            val: 2,
                            next: last
                        }
                    }
                }
            }
        }
    }
}
last.next = test1.next.next.next
/*
console.log(utils.inspect(hasCycle(
    test1
), { showHidden: false, depth: null }))
*/

function hasCycle2 (head) {
    if (!head) return null

    let fast = head
    let slow = head

    // 快慢指针
    while (fast && fast.next && slow) {
        fast = fast.next.next
        slow = slow.next

        console.log(fast.val, slow.val)
        if (fast === slow) {
            let r = head

            while (r !== slow) {
                slow = slow.next
                r = r.next
            }

            return r
        }
    }

    return null
}
console.log(utils.inspect(hasCycle2(
    test1
), { showHidden: false, depth: null }))
