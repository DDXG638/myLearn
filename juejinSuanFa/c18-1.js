/**
 * 平衡二叉树的判定
 * 
 * 力扣：https://leetcode.cn/problems/balanced-binary-tree/
 * 
 * 一棵高度平衡二叉树定义为： 一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过1。
 * [3,9,20,null,null,15,7] 为平衡二叉树
 *     3
 *    / \
 *   9  20
 *     /  \
 *    15   7
 * 
 * [1,2,2,3,3,null,null,4,4] 不为平衡二叉树
 *        1
 *       / \
 *      2   2
 *     / \
 *    3   3
 *   / \
 *  4   4
 */

/**
 * 平衡二叉树的判定
 * 使用递归，计算左右子树的高度，判断高度差是否大于1
 * @param {*} root 
 * @returns 
 */
function isBalanced(root) {
  if (!root) return true
  let flag = true

  function dfs(node) {
    // 如果是空子树，高度是0，flag=false代表已经有答案了，就不需要继续了，返回什么值都不重要，只要return就行
    if (!flag ||!node) return 0
    const leftHeight = dfs(node.left) // 递归计算左子树的高度
    const rightHeight = dfs(node.right) // 递归计算右子树的高度

    // 如果左右子树高度差大于1，说明不是平衡二叉树
    if (Math.abs(leftHeight - rightHeight) > 1) {
      flag = false // 标记结果
      return 0 // 标记结果后，
    }

    return Math.max(leftHeight, rightHeight) + 1
  }

  dfs(root)
  
  return flag
}