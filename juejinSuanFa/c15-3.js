/**
 * 限定组合问题：及时回溯，即为“剪枝”
 * 
 * 题目描述：给定两个整数 n 和 k，返回 1 ... n 中所有可能的 k 个数的组合。
 * 
 * 示例: 输入: n = 4, k = 2
 * 输出: [[2,4],[3,4],[2,3],[1,2],[1,3],[1,4]]
 */

function combine(n, k) {
  const res = []
  const subRes = []

  function dfs(index) {
    if (subRes.length === k) {
      res.push(subRes.slice())
      return
    }

    for (let i = index; i < n; i++) {
      subRes.push(i + 1)
      dfs(i + 1)
      subRes.pop()
    }
  }

  dfs(0)

  return res
}

console.log('combine', JSON.stringify(combine(4, 4)))
