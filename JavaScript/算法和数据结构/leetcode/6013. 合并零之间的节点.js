/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 * https://leetcode-cn.com/problems/merge-nodes-in-between-zeros/
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var mergeNodes = function(head) {
    let cur = head;
    let res = cur;
    head = head.next;

    while(head.next) {
        if (head.val === 0) {
            cur = cur.next = head;
        } else {
            cur.val += head.val;
        }
        head = head.next;
    }

    cur.next = null;

    return res;
};
