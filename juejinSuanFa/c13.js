/**
 * 用栈实现一个队列
 * 
 * 题目描述：使用栈实现队列的下列操作：
 * push(x) -- 将一个元素放入队列的尾部
 * pop() -- 从队列首部移除元素
 * peek() -- 返回队列首部的元素
 * empty() -- 返回队列是否为空
 * 
 * 示例: MyQueue queue = new MyQueue();
 * queue.push(1);
 * queue.push(2);
 * queue.peek(); // 返回 1
 * queue.pop(); // 返回 1
 * queue.empty(); // 返回 false
 * 
 * 栈：push to top, peek/pop from top, size, 和 is empty 操作是合法的
 */

function SimpleQueue() {
  // 使用两个栈来实现队列
  this.stack = []
  // 与stack反转的栈，反转后栈顶的元素就是队列首部元素了，主要用来实现pop和peek
  this.reverseStack = []
}

SimpleQueue.prototype.push = function(val) {
  this.stack.push(val)
}

SimpleQueue.prototype.pop = function() {
  // 如果反转栈没有元素，需要将stack中的元素都反转到reverseStack中
  if (!this.reverseStack.length) {
    while(this.stack.length) {
      this.reverseStack.push(this.stack.pop())
    }
  }
  return this.reverseStack.pop()
}

SimpleQueue.prototype.peek = function() {
  if (!this.reverseStack.length) {
    while(this.stack.length) {
      this.reverseStack.push(this.stack.pop())
    }
  }
  return this.reverseStack[this.reverseStack.length - 1]
}

SimpleQueue.prototype.empty = function() {
  return this.stack.length === 0 && this.reverseStack.length === 0
}

SimpleQueue.prototype.print = function() {
  console.log('stack', this.stack)
  console.log('reverseStack', this.reverseStack)
}
