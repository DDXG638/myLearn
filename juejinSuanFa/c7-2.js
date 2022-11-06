/**
 * 合并两个有序数组, see: https://juejin.cn/book/6844733800300150797/section/6844733800350498824
 * 真题描述：
 * 给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。
 * 
 * 说明: 初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。
 * 你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。
 * 
 * 示例: 输入:
 * nums1 = [1,2,3,0,0,0], m = 3
 * nums2 = [2,5,6], n = 3
 * 输出: [1,2,2,3,5,6]
 */

/**
 * 使用splice方法，双指针，从头开始比较
 * @param {*} a1 
 * @param {*} a2 
 */
function mergeTwoArr(a1, a2) {
  let i1 = 0
  let i2 = 0
  while(i2 < a2.length) {
    if (!a1[i1] || a2[i2] <= a1[i1]) {
      a1.splice(i1, 0, a2[i2])
      i1++
      i2++
    } else {
      i1++
    }
  }
  console.log('使用splice方法的版本：', a1)
}

mergeTwoArr([1, 5, 8], [-1, 2, 5, 6, 9, 10, 12])

/**
 * 不使用splice方法，补齐a1的长度，从后往前比较，每次取最大的填补a1空位
 * @param {*} a1 
 * @param {*} a2 
 */
function mergeTwoArr2(a1, a2) {
  let i1 = a1.length - 1
  let i2 = a2.length - 1

  // 补齐a1
  for(let i = 0; i < a2.length; i++) {
    a1.push(0)
  }

  let valueIndex = a1.length - 1 // 填值的下表，从a1的最后一位开始
  while(i2 >= 0) {
    if (i1 >= 0 && a1[i1] >= a2[i2]) {
      a1[valueIndex] = a1[i1]
      i1--
    } else {
      a1[valueIndex] = a2[i2]
      i2--
    }
    valueIndex--
  }

  console.log('不使用splice方法的版本', a1)
}

mergeTwoArr2([1, 5, 8], [-1, 2, 5, 6, 9, 10, 12])
