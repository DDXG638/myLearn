/*
* http://www.codewars.com/kata/5390bac347d09b7da40006f6/train/javascript
* var str = "How can mirrors be real if our eyes aren't real";
 Test.assertEquals(str.toJadenCase(), "How Can Mirrors Be Real If Our Eyes Aren't Real");
* */

/**
 * 今天的和昨天相比好了不少，但是，还是有一点小问题
 * 1、i++ 要连在一起
 * 2、代码换行
        变量声明后（当变量声明在代码块的最后一行时，则无需空行）
        注释前（当注释在代码块的第一行时，则无需空行）
        代码块后（在函数调用、数组、对象中则无需空行）
        文件最后
 * */
String.prototype.toJadenCase = function () {
    var strArr = this.split(' ');
    for(var i = 0; i < strArr.length; i ++){
        strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].substring(1);
    }
    return strArr.join(' ');
};

/**
 * 优化格式，注意代码块之间的换行，定义、循环、返回结果
 * */
String.prototype.toJadenCase = function () {
    var strArr = this.split(' ');

    for(var i = 0; i < strArr.length; i++){
        strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].substring(1);
    }

    return strArr.join(' ');
};

/**
 * 我的思路
 * */
String.prototype.toJadenCase = function () {
    return this.split(' ').map(function (item) {
        return item[0].toUpperCase() + item.slice(1);
    }).join(' ');
};