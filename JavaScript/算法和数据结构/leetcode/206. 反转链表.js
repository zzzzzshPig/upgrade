/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    let next = null

    while (head) {
        const n = head.next
        head.next = next
        next = head
        head = n
    }

    return next
};
console.log(reverseList({
    val: 1,
    next: {
        value: 2,
        next: null
    }
}))
