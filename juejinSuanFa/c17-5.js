/**
 * 将排序数组转化为二叉搜索树
 * 力扣：https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/
 * 
 * 题目描述：将一个按照升序排列的有序数组，转换为一棵高度平衡二叉搜索树。本题中，一个高度平衡二叉树是指一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1。
 * 示例: 给定有序数组: [-10,-3,0,5,9]
 * 一个可能的答案是：[0,-3,9,-10,null,5]，它可以表示下面这个高度平衡二叉搜索树：
 *       0
 *      / \
 *    -3   9
 *    /   /
 *  -10  5
 * 
 * 我们可以认为题目中给出的数组就是目标二叉树的中序遍历序列
 */

function buildBST(nums, left, right) {
  if (left > right) return null
  // left + (right - left)/2  (left + right) / 2
  const mid = Math.floor((left + right) / 2)
  const root = new TreeNode(nums[mid])
  root.left = buildBST(nums, left, mid - 1)
  root.right = buildBST(nums, mid + 1, right)

  return root
}

function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val)
  this.left = (left === undefined ? null : left)
  this.right = (right === undefined ? null : right)
}

const res = buildBST([1,2,3,4,5,6,7,8,9,10,11,12], 0, 11)
console.log('排序数组转为二叉搜索树', JSON.stringify(res, null, 2))
