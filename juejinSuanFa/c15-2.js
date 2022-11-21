/**
 * 题目描述：给定一组不含重复元素的整数数组 nums，返回该数组所有可能的子集（幂集）。
 * 说明：解集不能包含重复的子集。
 * 
 * 示例: 输入: nums = [1,2,3]
 * 输出：[[1],[2],[3],[1,2,3],[2,3],[1,2],[1,3]]
 */

function subsets(nums) {
  const res = []
  const subRes = []

  function dfs(index) {
    res.push(subRes.slice())

    for (let i = index; i < nums.length; i++) {
      subRes.push(nums[i])
      dfs(i + 1)
      subRes.pop()
    }
  }

  dfs(0)

  return res
}

console.log('subsets: ', JSON.stringify(subsets([1, 2, 3, 4])))
