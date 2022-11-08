/**
 * 如何判断链表是否成环
 * 
 * 真题描述：给定一个链表，判断链表中是否有环。
 * 
 * 示例 1：
 * 输入：[3,2,0,4]（链表结构如下图） 输出：true
 * 解释：链表中存在一个环
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

function isLoopListNode(listNode) {
  let slow = listNode
  let fast = listNode.next

  while(fast && fast.next) {
    console.log(fast.val, slow.val)
    if (fast === slow) {
      return true
    }
    fast = fast.next.next
    slow = slow.next
  }

  return false
}

const listNode = new ListNode(1)
listNode.next = new ListNode(2)
listNode.next.next = new ListNode(3)
// listNode.next.next.next = new ListNode(4)
// listNode.next.next.next.next = new ListNode(5)
// listNode.next.next.next.next.next = new ListNode(6)

console.log('是否是环链表：', isLoopListNode(listNode))
