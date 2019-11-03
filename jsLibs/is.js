
/**
 * ES6 Object.is() 方法的polyfill，两个值是否绝对相等，
 * 处理了 +0 === -0 => true; NaN === NaN => false的问题
 * see:https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 * @param {*} a 
 * @param {*} b 
 */
function objectIs(a, b) {
    // 先处理+0与-0的问题；1/+0 = Infinith, 1/-0 = -Infinity, Infinity === -Infinity => false
    if (a === 0 && b === 0) {
        return 1 / a === 1 / b
    }

    // 如果a是NaN，那b也要是NaN才能使得 a === b为true
    if (a !== a) {
        return b !== b
    }

    return a === b
}

console.log(objectIs(+0, -0)) // false

console.log(objectIs(1 / 'foo', NaN)) // true

console.log(objectIs(12, '12')) // false

module.exports = objectIs