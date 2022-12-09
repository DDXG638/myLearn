/**
 * 题目描述：翻转一棵二叉树。
 * 
 * 输入：
 *      4
 *    /   \
 *   2     7
 *  / \   / \
 * 1   3 6   9
 * 输出
 *      4
 *    /   \
 *   7     2
 *  / \   / \
 * 9   6 3   1
 */

const root = {
  val: '4',
  left: {
    val: '2',
    left: { val: '1' },
    right: { val: '3' }
  },
  right: {
    val: '7',
    left: { val: '6' },
    right: { val: '9' }
  }
}

function invertTree(tree) {
  if (tree) {
    const temp = tree.left
    tree.left = tree.right
    tree.right = temp
    invertTree(tree.left)
    invertTree(tree.right)
  }
}

invertTree(root)
console.log('反转二叉树', JSON.stringify(root, null, 2))
