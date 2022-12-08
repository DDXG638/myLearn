/**
 * 层序遍历的衍生问题
 * 
 * 题目描述：给你一个二叉树，请你返回其按 层序遍历 得到的节点值。 （即逐层地，从左到右访问所有节点）
 * 
 * 示例： 二叉树：[3,9,20,null,null,15,7],
 *   3
 *  / \
 * 9  20
 *   /  \
 *  15   7
 * 
 * 返回其层次遍历结果：
 * [
 * [3],
 * [9,20],
 * [15,7]
 * ]
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
      val: "G",
      left: { val: "H" },
      right: { val: "I" }
    }
  }
}

/**
 * 二叉树层序遍历：
 * 
 *     A
 *    / \
 *   B   C
 *  / \ / \
 * D  E,G  F
 *     / \
 *    H   I
 * @param {*} tree 
 * @returns 
 */
function sequenceTraversal(tree) {
  const queue = []
  const res = []

  tree && queue.push(tree)

  while(queue.length) {
    const subRes = []
    const len = queue.length
    for(let i = 0; i < len; i++) {
      const top = queue.shift()
      subRes.push(top.val)
      top.left && queue.push(top.left)
      top.right && queue.push(top.right)
    }
    res.push(subRes)
  }

  return res
}

// [[A],[B,C],[D,E,G,F],[H,I]]
console.log('层序遍历：', JSON.stringify(sequenceTraversal(root)))
