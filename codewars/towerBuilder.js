/*
	https://www.codewars.com/kata/build-tower/train/javascript/599466bcb1429849c90000d2
	Test.assertEquals(JSON.stringify(towerBuilder(1)), JSON.stringify(["*"]));
	Test.assertEquals(JSON.stringify(towerBuilder(2)), JSON.stringify([" * ","***"]));
	Test.assertEquals(JSON.stringify(towerBuilder(3)), JSON.stringify(["  *  "," *** ","*****"]));
*/


/**
 * 1、不要出现 kong这样的变量命名
 * 2、注释尽力写在代码上面，和代码不是同一行，尽量通过良好的变量命名规范和代码格式，让程序变得更加易读
 * 3、注意代码的规范，仔细看一下  我们的前端编码规范
 * 4、通过var定义变量的时候，尽量全部放到函数的最上面，尽量避免在for循环里面去定义变量，虽然，二者的效果是一致的
 * 5、三元表达式的话，可以改变一下写法 str += (j <= kong || j > (col + kong)) ? ' ' : '*'，这样更容易读懂
 * */
function towerBuilder(nFloors) {
  var z = 2 * nFloors - 1;//总列数
  var res = [];
  for(var i = 1;i <= nFloors; i++){ //循环次数nFloors
    var str = '';
    var col = (2 * i) - 1;//每行*的个数
    var kong = (z - col) / 2;//每行空格的个数
    for(var j = 1; j <= z; j++){
      j <= kong || j > (col + kong) ? str += ' ' : str += '*';
    }
    str.length > 0 && res.push(str);
  }
  return res;
}

/**
 * 我的实现
 * */
function towerBuilder(nFloors) {
    return Array(nFloors).fill('').map(function (item, index) {
        var curIndex = index + 1;
        return [
            ' '.repeat(nFloors - curIndex),
            '*'.repeat(2 * curIndex - 1),
            ' '.repeat(nFloors - curIndex)
        ].join('');
    });
}