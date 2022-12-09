/**
 * 二叉搜索树-插入值
 *      4
 *    /   \
 *   2     7
 *  / \   / \
 * 1   3 6   9
 *          / \
 *         8  20
 */

const root = {
  val: 4,
  left: {
    val: 2,
    left: { val: 1 },
    right: { val: 3 }
  },
  right: {
    val: 7,
    left: { val: 6 },
    right: { val: 9 }
  }
}

function binarySearchTreeInsert(node, val) {
  if (!node) {
    node = { val: val }
    return node
  }

  if (val <= node.val) {
    node.left = binarySearchTreeInsert(node.left, val)
  } else {
    node.right = binarySearchTreeInsert(node.right, val)
  }

  return node
}

const res = binarySearchTreeInsert(root, 8)

console.log(JSON.stringify(res, null, 2))
