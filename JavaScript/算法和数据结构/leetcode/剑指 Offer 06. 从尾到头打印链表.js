/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {number[]}
 */
var reversePrint = function(head) {
    let res = ''

    while (head) {
        res = head.val + ' ' + res
        head = head.next
    }

    return res.trim().split(' ').map(a => Number(a))
};
