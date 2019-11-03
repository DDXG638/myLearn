
/**
 * 判断一个n是否为-0，因为 -0 === +0 => true，难以判断
 * @param {*} n 
 */
function isNegZero(n) {
    // 先转成数字，-0  转为字符串都为 '0'
    // '-0' 转为数字为 -0，不变
    n = Number(n)
    
    // 1/-0 = -Infinity；1/0=Infinity
    return (n === 0) && (1 / n === -Infinity)
}


console.log(isNegZero(0)) // false
console.log(isNegZero(-0)) // true
console.log(isNegZero(1)) // false
console.log(isNegZero('0')) // false
console.log(isNegZero('-0')) // true
console.log(isNegZero(-123)) // false


module.exports = isNegZero