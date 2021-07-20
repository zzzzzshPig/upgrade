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
var middleNode = function(head) {
    let len = 0
    let head1 = head

    while (head) {
        len++
        head = head.next
    }

    len = Math.floor(len / 2)

    while (head1) {
        if (len === 0) return head1

        len--

        head1 = head1.next
    }
};
