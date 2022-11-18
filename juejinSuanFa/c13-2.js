/**
 * 双端队列 - 滑动窗口问题
 * 双端队列就是允许在队列的两端进行插入和删除的队列。
 * see: https://juejin.cn/book/6844733800300150797/section/6844733800358871054
 * 
 * 题目描述：
 * 给定一个数组 nums 和滑动窗口的大小 k，请找出所有滑动窗口里的最大值。
 * 
 * 示例: 输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3 输出: [3,3,5,5,6,7]
 * 
 * 提示：你可以假设 k 总是有效的，在输入数组不为空的情况下，1 ≤ k ≤ 输入数组的大小。
 * 
 * TODO: 不是特别的理解，需要二刷
 */

function maxSlidingWindow(nums, k) {
  if (k === 1) return nums

  const res = []
  const deque = [] // 有效递减双端队列，存储递减元素的下标
  const len = nums.length

  for (let i = 0; i < len; i++) {
    // 1、有效递减双端队列
    // 从deque的尾部开始判断，只要小于nums[i]的元素都出栈，不需要了
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop()
    }
    deque.push(i)

    // 2、deque队列的有效值，队列中的元素必须是 活动区间 的元素
    while(deque.length && deque[0] <= i - k) {
      deque.shift()
    }

    // 3、结果
    if (i >= k - 1) {
      res.push(nums[deque[0]])
    }
  }

  return res
}

console.log('滑动窗口问题', maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3))
console.log('滑动窗口问题2', maxSlidingWindow([1,3,-1,-3,5,3,6,7], 4))
console.log('滑动窗口问题3', maxSlidingWindow([8,4,-1,3,-5,4,1,7], 3))
console.log('滑动窗口问题4', maxSlidingWindow([8,4,-1,3,-5,4,1,7], 2))
console.log('滑动窗口问题5', maxSlidingWindow([8,4,-1,3,-5,4,1,7], 4))
console.log('滑动窗口问题6', maxSlidingWindow([8,4,-1,3,4,-5,4,7,1,7], 4))
console.log('滑动窗口问题7', maxSlidingWindow([8,4,-1,3,4,-5,4,7,1,7], 3))
