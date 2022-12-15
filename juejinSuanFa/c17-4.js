/**
 * 二叉搜索树的验证
 * see: https://juejin.cn/book/6844733800300150797/section/6844733800363065351 第二次提交解法比较好
 * 力扣：https://leetcode.cn/problems/validate-binary-search-tree/submissions/
 *         5
 *       /   \
 *      4     6
 *     / \   / \
 *    1   8 3   7
 */

/**
 * 每一次只判断根节点
 * @param {*} tree 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function isValidBST(tree, min = -Infinity, max = Infinity) {
  if (!tree) return true // 空树合法

  if (tree.val < max && tree.val > min) {
    return isValidBST(tree.left, min, tree.val) && isValidBST(tree.right, tree.val, max)
  } else {
    return false
  }
}
