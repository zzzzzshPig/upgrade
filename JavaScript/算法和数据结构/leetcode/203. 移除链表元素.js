/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function(head, val) {
    let res = {
        next: head
    }

    let node = res

    while (node.next) {
        if (node.next.val === val) {
            node.next = node.next.next
        } else {
            node = node.next
        }
    }

    return res.next
};
