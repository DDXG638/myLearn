/**
 * 两个有序链表的合并
 */

function ListNode(val) {
  this.val = val
  this.next = null
}

function mergeOrderedListNode(list1, list2) {
  const head = new ListNode('')
  let cur = head
  let l1 = list1
  let l2 = list2

  while(l1 && l2) {
    if (l1.val < l2.val) {
      cur.next = l1
      l1 = l1.next
    } else {
      cur.next = l2
      l2 = l2.next
    }
    cur = cur.next
  }

  if (l1) {
    cur.next = l1
  } else if (l2) {
    cur.next = l2
  }

  return head.next
}

const list1 = new ListNode(1)
list1.next = new ListNode(3)
list1.next.next = new ListNode(5)

const list2 = new ListNode(2)
list2.next = new ListNode(4)
list2.next.next = new ListNode(6)
list2.next.next.next = new ListNode(8)
list2.next.next.next.next = new ListNode(10)

const newList = mergeOrderedListNode(list1, list2)

const res = []
let ccc = newList
while(ccc) {
  res.push(ccc.val)
  ccc = ccc.next
}

console.log('链表合并结果：', res)
