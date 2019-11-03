

/**
 * ES6 Nunber.isNaN() 方法的polyfill，判断传入的值是否是NaN
 * see:https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isnan
 * 全局函数 isNaN() 会强制将参数转换成数字，使得isNaN('bbb') => true
 * @param {*} n 
 */
function numberIsNaN(n) {
    // 先判断是否是数字
    return (typeof n === 'number') && isNaN(n)
}


/**
 * 另一种巧妙地方法，NaN是js中唯一一个不等于自身的值
 * @param {*} value 
 */
function numberIsNaN2(value) {
    return value !== value
}


console.log(isNaN(1 / 'vvv')) // true
console.log(isNaN('ooo')) // true
console.log(numberIsNaN(1 / 'vvv')) // true
console.log(numberIsNaN('ooo')) // false


module.exports = numberIsNaN