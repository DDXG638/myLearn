/**
 * 三数求和问题
 * 
 * 真题描述：
 * 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，
 * 使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组。不可以包含重复的三元组
 * 
 * 示例：
 * 给定数组 nums = [-1, 0, 1, 2, -1, -4]， 满足要求的三元组集合为： [ [-1, 0, 1], [-1, -1, 2] ]
 */

function sumThree(nums, target) {
  const res = []
  
  // 先排个序，使用双指针往往需要有序数组
  // [-4, -1, -1, 0, 1, 2]
  nums.sort(function(a, b) {
    return a - b
  })

  const lastIndex = nums.length - 1

  for(let i = 0; i < nums.length - 2; i++) { // 遍历到倒数第三个元素就要停止了
    if (i > 0 && nums[i] === nums[i - 1]) continue
    let left = i + 1
    let right = lastIndex
    while (right > left) {
      const sum = nums[left] + nums[right] + nums[i]
      if (sum === target) {
        res.push([nums[i], nums[left], nums[right]])
        left++
        while(left < right && nums[left - 1] === nums[left]) {
          left++
        }
        right--
        while(left < right && nums[right + 1] === nums[right]) {
          right--
        }
      } else if (sum > target) {
        right--
        while(left < right && nums[right + 1] === nums[right]) {
          right--
        }
      } else {
        left++
        while(left < right && nums[left - 1] === nums[left]) {
          left++
        }
      }
    }
  }

  return res
}

// console.log('结果：', JSON.stringify(sumThree([-1, 0, 1, 2, -1, -4], 0)))
console.log('结果：', JSON.stringify(sumThree([-1, 0, 1, 2, -1, -4, 1, 4, 4], 0)))

const threeSum = function(nums) {
  // 用于存放结果数组
  let res = [] 
  // 给 nums 排序
  nums = nums.sort((a,b)=>{
      return a-b
  })
  // 缓存数组长度
  const len = nums.length
  // 注意我们遍历到倒数第三个数就足够了，因为左右指针会遍历后面两个数
  for(let i=0;i<len-2;i++) {
      // 左指针 j
      let j=i+1 
      // 右指针k
      let k=len-1   
      // 如果遇到重复的数字，则跳过
      if(i>0&&nums[i]===nums[i-1]) {
          continue
      }
      while(j<k) {
          // 三数之和小于0，左指针前进
          if(nums[i]+nums[j]+nums[k]<0){
              j++
             // 处理左指针元素重复的情况
             while(j<k&&nums[j]===nums[j-1]) {
                  j++
              }
          } else if(nums[i]+nums[j]+nums[k]>0){
              // 三数之和大于0，右指针后退
              k--
             
             // 处理右指针元素重复的情况
             while(j<k&&nums[k]===nums[k+1]) {
                  k--
              }
          } else {
              // 得到目标数字组合，推入结果数组
              res.push([nums[i],nums[j],nums[k]])
              
              // 左右指针一起前进
              j++  
              k--
             
              // 若左指针元素重复，跳过
              while(j<k&&nums[j]===nums[j-1]) {
                  j++
              }  
             
             // 若右指针元素重复，跳过
             while(j<k&&nums[k]===nums[k+1]) {
                  k--
              }
          }
      }
  }
  
  // 返回结果数组
  return res
}

console.log('掘金：', JSON.stringify(threeSum([-1, 0, 1, 2, -1, -4, 1, 4])))
