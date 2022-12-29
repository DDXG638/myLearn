/**
 * 平衡二叉树的构造
 * 
 * 力扣：https://leetcode.cn/problems/balance-a-binary-search-tree/
 * 
 * 题目描述：给你一棵二叉搜索树，请你返回一棵平衡后的二叉搜索树，新生成的树应该与原来的树有着相同的节点值。
 * 
 * 如果一棵二叉搜索树中，每个节点的两棵子树高度差不超过 1 ，我们就称这棵二叉搜索树是平衡的。
 */

function makeBalanceBST(root) {
  // 1、中序遍历二叉搜索树
  const arr = inorderTraversal(root)
  // 2、有序数组生成平衡二叉树
  return buildBST(arr)
}

// c16-1.js
function inorderTraversal(root) {
  const res = []
  const stack = []
  let cur = root

  while(cur) {
    stack.push(cur)
    cur = cur.left
  }

  while(stack.length) {
    const top = stack.pop()
    res.push(top.val)
    if (top.right) {
      cur = top.right
      while(cur) {
        stack.push(cur)
        cur = cur.left
      }
    }
  }

  return res
}

// c17-5.js
function buildBST(arr) {
  function dfs(arr, left, right) {
    if (left > right) return null

    const mid = Math.floor((left + right) / 2)
    const node = new TreeNode(arr[mid])
    node.left = dfs(arr, left, mid - 1)
    node.right = dfs(arr, mid + 1, right)

    return node
  }

  return dfs(arr, 0, arr.length - 1)
}

function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val)
  this.left = (left === undefined ? null : left)
  this.right = (right === undefined ? null : right)
}
