/**
 * 链表结点的删除
 * 
 * 真题描述：给定一个排序链表，删除所有重复的元素，使得每个元素只出现一次。
 * 
 * 示例：输入: 1->1->2 输出: 1->2 ； 输入: 1->1->2->3->3 输出: 1->2->3
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

function deleteSameListNode(listNode) {
  let cur = listNode

  while(cur && cur.next) {
    if (cur.val === cur.next.val) {
      cur.next = cur.next.next
    } else {
      cur = cur.next
    }
  }

  return listNode
}

const listNode = new ListNode(1)
listNode.next = new ListNode(1)
listNode.next.next = new ListNode(2)
listNode.next.next.next = new ListNode(2)
listNode.next.next.next.next = new ListNode(2)
listNode.next.next.next.next.next = new ListNode(4)

console.log('删除重复的链表：', showListNodeResule(deleteSameListNode(listNode)))
