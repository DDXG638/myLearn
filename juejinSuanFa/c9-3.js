/**
 * 删除问题的延伸——dummy 结点登场
 * 
 * 真题描述：给定一个排序链表，删除所有含有重复数字的结点，只保留原始链表中 没有重复出现的数字。
 * 
 * 示例:
 * 输入: 1->2->3->3->4->4->5  输出: 1->2->5;  输入: head -> 1->1->1->2->3  输出: 2->3
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

function deleteAllSameListNode(listNode) {
  if (!listNode || !listNode.next) return listNode
  // head->1->2->3->3->4->4->5
  const head = new ListNode(-1)
  head.next = listNode
  let cur = head
  let lastDeleteVal = ''

  while(cur && cur.next && cur.next.next) {
    if (cur.next.val === lastDeleteVal) {
      cur.next = cur.next.next
    } else if (cur.next.val === cur.next.next.val) {
      lastDeleteVal = cur.next.val
      cur.next = cur.next.next.next
    } else {
      cur = cur.next
    }
  }

  // 后续补丁，有可能最后两个重复的值是没有判断到的，需要后续再处理一下
  if (cur && cur.next && cur.next.val === lastDeleteVal) {
    cur.next = cur.next.next
  }

  return head.next
}

// 上面的方法是用lastDeleteVal变量记录上一次删除的数字，来解决2个以上重复数字的问题
// 并且需要一个后续补丁处理最后3个连续数字的问题
// 下面的方法是另一种处理方式，增加一个while循环处理2个连续数字以上的情况，理解起来会简单一点
function deleteAllSameListNode2(listNode) {
  if (!listNode || !listNode.next) return listNode
  // head->1->2->3->3->4->4->5
  const head = new ListNode(-1)
  head.next = listNode
  let cur = head

  while(cur && cur.next && cur.next.next) {
    if (cur.next.val === cur.next.next.val) {
      const deleteVal = cur.next.val
      // 增加一个while循环一次性把连续的节点都删掉
      while (cur.next && cur.next.val === deleteVal) {
        cur.next = cur.next.next
      }
    } else {
      cur = cur.next
    }
  }

  return head.next
}

// 1->3->3->3->4->5->5->5
const listNode = new ListNode(1)
listNode.next = new ListNode(3)
listNode.next.next = new ListNode(3)
listNode.next.next.next = new ListNode(3)
listNode.next.next.next.next = new ListNode(4)
listNode.next.next.next.next.next = new ListNode(5)
listNode.next.next.next.next.next.next = new ListNode(5)
listNode.next.next.next.next.next.next.next = new ListNode(5)
// listNode.next.next.next.next.next.next.next.next = new ListNode(6)
// listNode.next.next.next.next.next.next.next.next.next = new ListNode(6)
console.log('删除链表中所有重复的元素：', showListNodeResule(deleteAllSameListNode2(listNode)))
