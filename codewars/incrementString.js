
/*
https://www.codewars.com/kata/54a91a4883a7de5d7800009c/train/javascript
console.log(incrementString("foobar000"), "foobar001");
console.log(incrementString("foo"), "foo1");
console.log(incrementString("foobar001"), "foobar002");
console.log(incrementString("foobar99"), "foobar100");
console.log(incrementString("foobar099"), "foobar100");
console.log(incrementString(""), "1");
*/
function incrementString (strng) {
  // return incrementedString
	if(strng.length === 0)
		return "1";
	var temp;
	var res;
	for(var i = strng.length - 1; i >= 0; i--) {

		temp = parseInt(strng.substring(i));
		if(isNaN(temp)){
			res = strng + 1;
			break;
		}
		if(temp % 9 !== 0 || temp === 0){
			res = strng.substring(0,i) + (temp + 1);
			break;
		}else if(temp % 9 === 0 && isNaN(parseInt(strng.substring(i - 1)))){
			res = strng.substring(0,i) + (temp + 1);
			break;
		}else{
			continue;
		}
	}
	return res;
}

function incrementString(string) {
    string = string || '';
    if (!string) {
        return '1';
    }

    var result = string.match(/\d/);
    if (!result) {
        return string + '1';
    }

    var num = string.substring(result.index);
    var nextNum = +num + 1 + '';
    var curLength = num.length;
    var nextLength = nextNum.length;
    var padStart = function (str, length, pad) {
        return Array(length).fill(pad).join('') + str;
    };

    return string.substring(0, result.index) + (curLength > nextLength ? padStart(nextNum, curLength - nextLength, '0') : nextNum);
}

function incrementString(string) {
    return string.replace(/(\D*)(\d*)/, function (match, $1, $2) {
        var nextNum = +$2 + 1 + '';
        return $1 + $2.slice(0, -nextNum.length) + nextNum;
    });
}

console.log(incrementString("foobar000"), "foobar001");
console.log(incrementString("foo"), "foo1");
console.log(incrementString("foobar001"), "foobar002");
console.log(incrementString("foobar99"), "foobar100");
console.log(incrementString("foobar099"), "foobar100");
console.log(incrementString(""), "1");