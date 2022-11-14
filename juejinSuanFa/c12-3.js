/**
 * “最小栈”问题
 * 
 * 题目描述：
 * 设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。
 * 
 * push(x) —— 将元素 x 推入栈中；pop() —— 删除栈顶的元素。top() —— 获取栈顶元素。getMin() —— 检索栈中的最小元素。
 */

function MinStack() {
  this.stack = []
  // 定义一个递减栈，用来存放最小值栈
  this.minStack = []
}

MinStack.prototype.push = function(val) {
  this.stack.push(val)
  // 只有val小于等于minStack栈顶，val才入栈minStack
  if (!this.minStack.length || val <= this.minStack[this.minStack.length - 1]) {
    this.minStack.push(val)
  }
}

MinStack.prototype.pop = function() {
  const popVal = this.stack.pop()
  // 如果出栈元素跟minStack栈顶一直，则minStack也要出栈
  if (popVal === this.minStack[this.minStack.length - 1]) {
    this.minStack.pop()
  }
  return popVal
}

MinStack.prototype.top = function() {
  return this.stack.length ? this.stack[this.stack.length - 1] : undefined
}

MinStack.prototype.getMin = function() {
  return this.minStack.length ? this.minStack[this.minStack.length - 1] : undefined
}

MinStack.prototype.print = function() {
  console.log('stack', this.stack)
  console.log('minStack', this.minStack)
}

const minStack = new MinStack()
minStack.push(6)
minStack.push(8)
minStack.push(3)
minStack.push(4)
minStack.push(7)
minStack.print()
minStack.pop()
minStack.print()
console.log('top:', minStack.top())
console.log('min:', minStack.getMin())
minStack.pop()
console.log('min:', minStack.getMin())
minStack.pop()
console.log('min:', minStack.getMin())
minStack.pop()
console.log('min:', minStack.getMin())
