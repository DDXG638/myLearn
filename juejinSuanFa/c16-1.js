/**
 * 二叉树迭代遍历：
 * 1、先序遍历，根结点 -> 左子树 -> 右子树
 * 
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
 * 流程：
 * 1、根节点入栈
 * 2、取出栈顶元素，将栈顶元素的值入栈结果数组
 * 3、如果栈顶元素有右子节点，则入栈右子节点
 * 4、如果栈顶元素有左子节点，则入栈最子节点
 * 5、重复2-4步骤，知道栈中没有元素
 * @param {*} tree 
 */
function preorderTraversal(tree) {

}
