/**
 * see: https://juejin.cn/book/6844733800300150797/section/6844733800354709511
 * “有效括号”问题
 * 
 * 题目描述：给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。
 * 有效字符串需满足： 左括号必须用相同类型的右括号闭合。
 * 左括号必须以正确的顺序闭合。
 * 注意空字符串可被认为是有效字符串。
 * 
 * 事例：输入: "()[]{}" 输出: true   输入: "(]" 输出: false
 */

const bracketMap = {
  ')': '(',
  ']': '[',
  '}': '{',
}

function isSameBracket(str) {
  const stack = []
  for(let i = 0; i < str.length; i++) {
    if (stack.length && bracketMap[str[i]] === stack[stack.length - 1]) {
      stack.pop()
    } else {
      stack.push(str[i])
    }
  }
  return stack.length === 0
}

console.log('是否有效括号：', isSameBracket('{[]}'))
