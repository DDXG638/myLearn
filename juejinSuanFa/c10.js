/**
 * see: https://juejin.cn/book/6844733800300150797/section/6844733800354676743
 * 快慢指针——删除链表的倒数第 N 个结点
 * 
 * 真题描述：给定一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
 * 
 * 示例： 给定一个链表: 1->2->3->4->5, 和 n = 2.
 * 当删除了倒数第二个结点后，链表变为 1->2->3->5.
 * 说明： 给定的 n 保证是有效的。
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

function deleteLastThNode(listNode, n) {
  const head = new ListNode(-1)
  head.next = listNode
  let slow = head
  let fast = head
  while (n > 0) {
    fast = fast.next
    n--
  }

  while(fast && fast.next) {
    fast = fast.next
    slow = slow.next
  }

  slow.next = slow.next.next ? slow.next.next : null

  return head.next
}

const listNode = new ListNode(1)
listNode.next = new ListNode(2)
listNode.next.next = new ListNode(3)
listNode.next.next.next = new ListNode(4)
listNode.next.next.next.next = new ListNode(5)
listNode.next.next.next.next.next = new ListNode(6)

console.log('删除链表的倒数第n个元素：', showListNodeResule(deleteLastThNode(listNode, 6)))
