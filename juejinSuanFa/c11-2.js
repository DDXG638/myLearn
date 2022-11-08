/**
 * 定位环的起点
 * 
 * 真题描述：给定一个链表，返回链表开始入环的第一个结点。 如果链表无环，则返回 null。
 * 
 * 示例 1：
 * 输入：head = [3,2,0,-4]（如下图） -4=>2
 * 输出：tail connects to node index 1 解释：链表中有一个环，其尾部连接到第二个结点。
 * 
 * 思路：遍历链表，没遍历一个节点就给节点增加一个标识，当再次遇到第一个有标识的节点，说明这个节点就是链表入环的第一个节点
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

function findLoopListNode(listNode) {

}
