/**
 * 给定一个非空字符串 s，最多删除一个字符。判断是否能成为回文字符串。
 * 
 * 示例 1: 输入: "aba"
 * 输出: True
 * 
 * 示例 2: 输入: "abca"
 * 输出: True
 * 解释: 你可以删除c字符。
 * 
 * 注意: 字符串只包含从 a-z 的小写字母。字符串的最大长度是50000。
 */

/**
 * 判断是否是回文字符串
 * @param {*} str 
 * @returns 
 */
function isPalindrome(str, left, right) {
  console.log('isPalindrome', left, right)
  while(right > left) {
    if (str[left] !== str[right]) {
      return false
    }
    right--
    left++
  }

  return true
}
// console.log('是否是回文：', isPalindrome('yesasey', 0, 6))

// 使用双指针，当左右指针不相同的时候，需要 左加 或 右减 进行判断
function isLikePalindrome(str) {
  let left = 0
  const len = str.length
  let right = len - 1
  while (right > left) {
    if (str[left] !== str[right]) {
      break
    }
    left++
    right--
  }
  if (right > left) {
    if (isPalindrome(str, left + 1, right)) {
      return true
    }
    if (isPalindrome(str, left, right - 1)) {
      return true
    }

    return false
  }

  return true
}

console.log('是否是类回文：', isLikePalindrome('yebccbcey'))
