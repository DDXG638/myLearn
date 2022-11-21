/**
 * see: https://juejin.cn/book/6844733800300150797/section/6844733800358871048
 * 全排列问题
 * 
 * 题目描述：给定一个没有重复数字的序列，返回其所有可能的全排列。
 * 
 * 示例：
 * 输入：[1,2,3]
 * 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[2,3,1],[3,2,1]]
 */

function permute(nums) {
  const res = [] // 结果数组
  const cur = [] // 当前排列数组
  const repeatMap = {} // 标记重复的对象
  const len = nums.length

  function dfs(index) {
    if (index >= len) {
      res.push([...cur])
      return
    }

    for (let i = 0; i < len; i++) {
      if (!repeatMap[i]) {
        repeatMap[i] = true
        cur.push(nums[i])
        dfs(index + 1)
        cur.pop()
        repeatMap[i] = false
      }
    }
  }

  dfs(0)

  return res
}

console.log('全排列问题：', JSON.stringify(permute([1,2,3,4])))
