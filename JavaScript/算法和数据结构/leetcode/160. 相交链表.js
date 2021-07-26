/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
    let a = 0
    let b = 0
    let A = headA
    let B = headB

    while (headA) {
        a++
        headA = headA.next
    }

    while (headB) {
        b++
        headB = headB.next
    }

    if (a < b) {
        [a, b, A, B] = [b, a, B, A]
    }

    let j = a - b

    while (B) {
        if (A === B) {
            return A
        }

        if (j <= 0) {
            B = B.next
        }

        A = A.next

        j--
    }

    return null
};
