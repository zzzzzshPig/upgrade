/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var getKthFromEnd = function(head, k) {
    // 快慢指针
    let s = head
    let q = head.next
    let i = 1

    while (q) {
        q = q.next

        if (i < k) {
            i++
        } else {
            s = s.next
        }
    }

    return s
};
