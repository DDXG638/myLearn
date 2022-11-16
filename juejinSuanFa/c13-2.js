/**
 * 滑动窗口问题
 * see: https://juejin.cn/book/6844733800300150797/section/6844733800358871054
 * 
 * 题目描述：
 * 给定一个数组 nums 和滑动窗口的大小 k，请找出所有滑动窗口里的最大值。
 * 
 * 示例: 输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3 输出: [3,3,5,5,6,7]
 * 
 * 提示：你可以假设 k 总是有效的，在输入数组不为空的情况下，1 ≤ k ≤ 输入数组的大小。
 */

function maxSlidingWindow(nums, k) {
  if (k === 1) return nums

  const res = []
  const queue = []
  const maxQueue = []

  for (let i = 0; i < k; i++) {
    queue.push(nums[i])
    if (maxQueue.length === 0 || nums[i] >= maxQueue[maxQueue.length - 1]) {
      maxQueue.push(nums[i])
    }
  }
  for (let j = k; j < nums.length; j++) {
    const max = maxQueue[maxQueue.length - 1]
    res.push(max)
    if (queue.shift() === max) {
      maxQueue.pop()
    }
    queue.push(nums[j])
    if (maxQueue.length === 0 || nums[j] >= maxQueue[maxQueue.length - 1]) {
      maxQueue.push(nums[j])
    }
  }

  res.push(maxQueue[maxQueue.length - 1])

  return res
}

console.log('滑动窗口问题', maxSlidingWindow([8,4,-1,3,-5,4,1,7], 3))
