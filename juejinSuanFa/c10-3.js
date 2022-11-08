/**
 * 局部反转一个链表
 * 
 * 真题描述：反转从位置 m 到 n 的链表。请使用一趟扫描完成反转。说明: 1 ≤ m ≤ n ≤ 链表长度。
 * 
 * 示例:
 * 输入: 1->2->3->4->5->NULL, m = 2, n = 4
 * 输出: 1->4->3->2->5->NULL
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

function reversePartListNode(listNode, m, n) {
  // 1、扫描一遍，根据[m, n]边界确定指针left=>m; right=>n
  const dummy = new ListNode(-1)
  dummy.next = listNode
  let left = null
  let right = null
  let beforeLeft = null
  let cur = dummy
  let count = 0

  while(cur) {
    count++
    if (count === m) {
      beforeLeft = cur
      left = cur.next
    }
    if (count === n) {
      right = cur.next
    }
    cur = cur.next
  }

  // 2、开始局部反转
  beforeLeft.next = right
  let pre = right.next // 这一步比较关键
  right.next = null
  while(left) {
    const next = left.next
    left.next = pre
    pre = left
    left = next
  }

  return dummy.next
}

const listNode = new ListNode(1)
listNode.next = new ListNode(2)
listNode.next.next = new ListNode(3)
listNode.next.next.next = new ListNode(4)
listNode.next.next.next.next = new ListNode(5)
listNode.next.next.next.next.next = new ListNode(6)

console.log('局部反转链表：', showListNodeResule(reversePartListNode(listNode, 1, 6)))
