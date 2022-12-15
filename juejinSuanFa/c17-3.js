/**
 * 二叉搜索树-删除值
 * 力扣真题(看题解会清晰点)：https://leetcode.cn/problems/delete-node-in-a-bst/submissions/
 *         4
 *       /   \
 *      2     15
 *     / \   / \
 *    1   3 6   18
 *         / \   \
 *        5   7  20
 * 
 * 1、先找到要删除的节点
 * 2、如果删除节点是叶子节点，则直接删除即可
 * 3、如果删除节点只有左子节点，需要取出左子树中最大的节点替换被删除的节点
 * 4、如果删除节点只有右子节点，需要取出右子树中最小的节点替换被删除的节点
 * 5、如果删除节点既有左子节点也有右子节点，则取出左子树的最大节点 和 右子树的最小节点 替换被删除节点都是可以的
 *          
 */

function binarySearchTreeDelete(tree, target) {
  if (!tree) return

  if (tree.val === target) {
    // 1、先找到要删除的节点
    if (tree.left) {
      // 3、如果删除节点只有左子节点，需要取出左子树中最大的节点替换被删除的节点
      const maxTreeNode = findMaxLeftTree(tree.left)
      tree.val = maxTreeNode.val
      // 这样才能把maxTreeNode节点删掉
      tree.left = binarySearchTreeDelete(tree.left, maxTreeNode.val)
    } else if (tree.right) {
      // 4、如果删除节点只有右子节点，需要取出右子树中最小的节点替换被删除的节点
      const minTreeNode = findMinRightTree(tree.right)
      tree.val = minTreeNode.val
      // 这样才能把maxTreeNode节点删掉
      tree.right = binarySearchTreeDelete(tree.right, minTreeNode.val)
    } else {
      // 2、如果删除节点是叶子节点，则直接删除即可
      tree = null
    }
  } else if (target > tree.val) {
    tree.right = binarySearchTreeDelete(tree.right, target)
  } else {
    tree.left = binarySearchTreeDelete(tree.left, target)
  }

  return tree
}

function findMaxLeftTree(node) {
  let cur = node
  while(cur.right) {
    cur = cur.right
  }
  return cur
}

function findMinRightTree(node) {
  let cur = node
  while(cur.left) {
    cur = cur.left
  }
  return cur
}
