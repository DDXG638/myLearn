/**
 * 多指针法——链表的反转
 * 
 * 真题描述：定义一个函数，输入一个链表的头结点，反转该链表并输出反转后链表的头结点。
 * 
 * 示例:
 * 输入: 1->2->3->4->5
 * 输出: 5->4->3->2->1
 */

function ListNode(val) {
  this.val = val
  this.next = null
}

function showListNodeResule(newList) {
  const res = []
  let ccc = newList
  while(ccc) {
    res.push(ccc.val)
    ccc = ccc.next
  }
  return res
}

function reverseListNode(listNode) {
  let pre = null
  let cur = listNode

  while(cur) {
    const next = cur.next
    cur.next = pre
    pre = cur
    cur = next
  }

  return pre
}

const listNode = new ListNode(1)
listNode.next = new ListNode(2)
listNode.next.next = new ListNode(3)
listNode.next.next.next = new ListNode(4)
listNode.next.next.next.next = new ListNode(5)
listNode.next.next.next.next.next = new ListNode(6)

console.log('反转链表：', showListNodeResule(reverseListNode(listNode)))
