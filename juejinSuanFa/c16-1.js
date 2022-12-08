/**
 * 二叉树迭代遍历：
 * 1、先序遍历，根结点 -> 左子树 -> 右子树
 * 
 *     A
 *    / \
 *   B   C
 *  / \ / \
 * D  E,G  F
 *     / \
 *    H   I
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
 * 先序遍历流程： 根 -> 左 -> 右
 * 从根节点开始，因为先序遍历的根节点肯定在第一位，所以使用push方法到结果数组
 * 1、根节点入栈
 * 2、取出栈顶元素，将栈顶元素的值入栈结果数组
 * 3、如果栈顶元素有右子节点，则入栈右子节点
 * 4、如果栈顶元素有左子节点，则入栈最子节点
 * 5、重复2-4步骤，直到栈中没有元素
 * @param {*} tree 
 */
function preorderTraversal(tree) {
  const res = []
  const stack = []
  tree && stack.push(tree)

  while(stack.length) {
    const top = stack.pop()
    res.push(top.val)
    top.right && stack.push(top.right)
    top.left && stack.push(top.left)
  }

  return res
}

// A B D E C G H I F
console.log('迭代法先序遍历一棵树：', preorderTraversal(root))



/**
 * 后续遍历 左 -> 右 -> 根
 * 从根节点开始，因为后序遍历的根节点肯定在结果数组的最后一位，所以使用unshift方法进入结果数组
 * 1、根节点入栈
 * 2、取出栈顶元素，将栈顶元素的值unshift进入结果数组
 * 3、如果栈顶元素有左子节点，则左子节点入栈
 * 4、如果栈顶元素有右子节点，则右子节点入栈（主要是为了在下一轮的时候，先处理右子节点，这样结果数组的顺序才是正确的）
 * 5、重复2-4步骤，直到栈中无元素
 * @param {*} tree 
 */
function postorderTraversal(tree) {
  const res = []
  const stack = []

  tree && stack.push(tree)

  while(stack.length) {
    const top = stack.pop()
    res.unshift(top.val)
    top.left && stack.push(top.left)
    top.right && stack.push(top.right)
  }

  return res
}

// ['D', 'E', 'B', 'H', 'I', 'G', 'F', 'C', 'A']
console.log('迭代法后序遍历一棵树：', postorderTraversal(root))



/**
 * 中序遍历： 左 -> 根 -> 右
 * 从最左子节点开始
 * 1、从根节点开始，一路遍历到最左子节点，沿途的节点全部入栈
 * 2、取出栈顶节点(最左子节点)，push进结果数组
 * 3、如果栈顶节点有右子节点，则从栈顶节点的右子节点开始一路遍历到最左子节点，沿途几点全部入栈
 * 4、重复步骤1-3，直到空栈
 * 
 * @param {*} tree 
 */
function inorderTraversal(tree) {
  const res = []
  const stack = []
  let cur = tree

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

// ['D', 'B', 'E', 'A', 'H', 'G', 'I', 'C', 'F']
console.log('迭代法中序遍历一棵树：', inorderTraversal(root))
