
// 左基右偶
let arr = [2,8,88,66,22,42,5,9,8,5,2,1,3,6,4,7,5];

function sort(arr) {
    arr.sort((a,b) => {
        let aa = a % 2;
        let bb = b % 2

        return bb - aa;
    })
}

// sort(arr)

// console.log(arr)


// 在字符串中找出第一个只出现一个的字符，没有就返回false
/* function find (str) {
    let arr = str.split('');
    let obj = {}
    arr.forEach(item => {
        obj[item] ? obj[item]++ : obj[item] = 1
    });

    for (let i = 0; i < arr.length; i++) {
      if(obj[arr[i]] === 1) {
        return arr[i]
      }
    }

    return false
}

let str = '12abraccdefbf'

console.log(find(str)) */


// switch 是否存在隐式转换,,,使用的是全等
/* function showCase(value) {
    switch (value) {
        case 'A':
            console.log('case A')
            break;

        case 'B':
            console.log('case B')
            break;
            
        case undefined:
            console.log('case undefined')
            break;

        case oo:
            console.log('case Object')
            break;

        default:
            console.log('do not know')
            break;
    }
}

var oo = new String('A')

showCase(oo) */

function rr(v,p,offest,string) {
    console.log('v', v, 'p', p,'offest',offest,'string',string)
    return parseInt(v)
}

console.log('1 2 3'.replace(/(\d)/g, rr))


/* var obj = {a: 111}

try {
    var t = 111;
    console.log(n)
} catch(err) {
    err = 2;
    // var t2 = err;
    // var t3 = 333
    // console.error(err)
}

console.log('t', t)
// console.log('t2', t2)
// console.log('t3', t3)
console.log('err', err) */