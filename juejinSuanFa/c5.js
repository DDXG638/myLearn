/**
 * url: https://juejin.cn/book/6844733800300150797/section/6844733800346288142
 * 
 * 二叉树定义：
 * - 它可以没有根结点，作为一棵空树存在
 * - 如果它不是空树，那么必须由根结点、左子树和右子树组成，且左右子树都是二叉树。
 * 
 * 二叉树递归遍历：
 * 1、先序遍历，根结点 -> 左子树 -> 右子树
 * 2、中序遍历，左子树 -> 根结点 -> 右子树
 * 3、后序遍历，左子树 -> 右子树 -> 根结点
 */

 const root = {
  val: "A",
  left: {
    val: "B",
    left: {
      val: "D"
    },
    right: {
      val: "E"
    }
  },
  right: {
    val: "C",
    right: {
      val: "F"
    },
    left: {
      val: "G"
    }
  }
}

/**
 * 先序遍历
 * @param {*} root 节点
 */
function preorder(root) {
  const res = []
  if (root) {
    res.push(root.val)
    res.push(...preorder(root.left))
    res.push(...preorder(root.right))
  }

  return res
}

console.log('先序遍历：', preorder(root)) // ['A', 'B', 'D', 'E', 'C', 'G', 'F']

/**
 * 中序遍历
 * @param {*} root 
 * @returns 
 */
function inorder(root) {
  const res = []
  if (root) {
    res.push(...inorder(root.left))
    res.push(root.val)
    res.push(...inorder(root.right))
  }

  return res
}

console.log('中序遍历：', inorder(root)) // ['D', 'B', 'E', 'A', 'G', 'C', 'F']


/**
 * 后序遍历
 * @param {*} root 
 * @returns 
 */
function postorder(root) {
  const res = []
  if (root) {
    res.push(...postorder(root.left))
    res.push(...postorder(root.right))
    res.push(root.val)
  }

  return res
}

console.log('后序遍历：', postorder(root)) // ['D', 'E', 'B', 'G', 'F', 'C', 'A']
