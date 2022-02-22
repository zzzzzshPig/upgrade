/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {number}
 * https://leetcode-cn.com/problems/maximum-twin-sum-of-a-linked-list/
 */
var pairSum = function(head) {
    let slow = head;
    let fast = head.next

    while(fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }

    let last = null;
    slow = slow.next;
    while(slow) {
        const cur = slow.next;
        slow.next = last;
        last = slow;
        slow = cur;
    }

    let res = 0;
    while(last) {
        res = Math.max(last.val + head.val, res);
        last = last.next;
        head = head.next;
    }

    return res;
};
