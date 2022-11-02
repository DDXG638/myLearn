/**
 * 真题描述:
 * 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
 * 你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。
 * 
 * 示例: 给定 nums = [2, 7, 11, 15], target = 9
 * 因为 nums[0] + nums[1] = 2 + 7 = 9 所以返回 [0, 1]
 */

// 方法一：使用两个for循环，只要nums[i] + nums[j] === 9,就输出i和j。时间复杂度O(n)

// 方法二：使用Map空间换时间，求和问题 转化为 求差问题

const nums = [2, 7, 11, 15]
const target = 9

/**
 * 只返回一组，map映射：值=>下标
 * @param {*} nums 
 * @param {*} target 
 * @returns 
 */
function twoSumToTarget(nums, target) {
  const map = {}
  for (let i = 0; i < nums.length; i++) {
    if (map[target - nums[i]] !== undefined) {
      return [map[target - nums[i]], i]
    }
    if (map[nums[i]] === undefined) {
      map[nums[i]] = i
    }
  }
}
// console.log('map空间换时间：', twoSumToTarget([8, 10, 2, 11, 7, 15, 1], target))
// console.log('map空间换时间：', twoSumToTarget([8, 10, 2, 1, 11, 7, 15, 1], target))

/**
 * 返回多组，map映射：值=>下标数组
 * @param {*} nums 
 * @param {*} target 
 * @returns 
 */
function twoSumToTarget2(nums, target) {
  const map = {}
  const res = []
  for (let i = 0; i < nums.length; i++) {
    if (map[target - nums[i]] !== undefined && map[target - nums[i]].length) {
      res.push([map[target - nums[i]].shift(), i])
      continue
    }
    if (map[nums[i]] === undefined) {
      map[nums[i]] = [i]
    } else {
      map[nums[i]].push(i)
    }
  }
  return res
}

// console.log('map空间换时间-多组数据', JSON.stringify(twoSumToTarget2(nums, target)))
console.log('map空间换时间-多组数据', JSON.stringify(twoSumToTarget2([8, 10, 2, 1, 11, 7, 8, 15, 1, 7], target)))
