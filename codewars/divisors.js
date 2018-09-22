/*
	https://www.codewars.com/kata/find-the-divisors/train/javascript/59945ba96a2b64a8860000cf
	Test.assertSimilar(divisors(15), [3, 5]);
	Test.assertSimilar(divisors(12), [2, 3, 4, 6]);
	Test.assertEquals(divisors(13), "13 is prime");
*/

function divisors(integer) {
  var res = [];
  var mid = Math.floor(integer / 2);
  for(var i = 2; i <= mid; i++){
    integer % i == 0 && res.push(i);
  }
  return res.length > 0 ? res : integer + ' is prime';
}


/**
 * 思路没问题，只有一个小建议，为了让代码可读性更高，可以把`&&`替换成 `if`
 * */
function divisors(integer) {
    var result = [];
    var mid = Math.floor(integer / 2);

    for (var i = 2; i <= mid; i++) {
        if (integer % i === 0) {
            result.push(i);
        }
    }

    return result.length > 0 ? result : integer + ' is prime';
}