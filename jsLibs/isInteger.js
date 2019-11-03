

/**
 * ES6 Nunber.isInteger() 方法的polyfill，判断是否为整数
 * @param {*} v 
 */
function numberIsInteger(v) {
    // 先判断是不是number，然后判断是否是有限数字，再判断是否有小数
    return (typeof v === 'number') && isFinite(v) && (v % 1 === 0)
}

console.log(numberIsInteger(0))         // true
console.log(numberIsInteger(1))         // true
console.log(numberIsInteger(-100000))   // true

console.log(numberIsInteger(0.1))       // false
console.log(numberIsInteger(Math.PI))   // false

console.log(numberIsInteger(Infinity))  // false
console.log(numberIsInteger(-Infinity)) // false
console.log(numberIsInteger("10"))      // false
console.log(numberIsInteger(true))      // false
console.log(numberIsInteger(false))     // false
console.log(numberIsInteger([1]))       // false

module.exports = numberIsInteger