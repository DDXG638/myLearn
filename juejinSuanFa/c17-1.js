/**
 * 二叉搜索树-查找
 */

const root = {
  val: 6,
  left: {
    val: 3,
    left: { val: 1 },
    right: { val: 4 }
  },
  right: {
    val: 8,
    left: { val: 7 },
    right: { val: 9 }
  }
}

function binarySearchTreeFind(tree, target) {
  if (!tree) return

  const val = tree.val
  if (val === target) {
    return tree
  } else if (target > val) {
    return binarySearchTreeFind(tree.right, target)
  } else {
    return binarySearchTreeFind(tree.left, target)
  }
}

const res = binarySearchTreeFind(root, 2)
console.log('二叉搜索树-查找', JSON.stringify(res))
