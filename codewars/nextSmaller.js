/*
	https://www.codewars.com/kata/5659c6d896bc135c4c00021e/train/javascript

	Test.describe("Fixed tests", function() {
		Test.it("Smaller numbers", function() {
	    Test.assertEquals(nextSmaller(21), 12)
	 		Test.assertEquals(nextSmaller(907), 790)
			Test.assertEquals(nextSmaller(531), 513)
			Test.assertEquals(nextSmaller(135), -1)
			Test.assertEquals(nextSmaller(2071), 2017)
			Test.assertEquals(nextSmaller(1027), -1)
			Test.assertEquals(nextSmaller(414), 144)
		})
	  
		Test.it("Bigger numbers", function() {
			Test.assertEquals(nextSmaller(123456798), 123456789)
			Test.assertEquals(nextSmaller(123456789), -1)
			Test.assertEquals(nextSmaller(1234567908), 1234567890)
		})
	})
	网上有一道找更大数的题目，觉得跟这题思路是一样的，挺佩服的
	// 1.从左往右找到一个相邻的a和b，且a>b
	// 2.在数组arr中以i为分界点，找到arr[i]右边的数字（小于arr[i-1]）中最大的一个
	// 3.arr[i-1]与arr[max]位置交换
	// 4.arr中，下标为i之后的数字按从大到小排序
	http://www.geeksforgeeks.org/find-next-greater-number-set-digits/
*/

function nextSmaller (n) {
	var arr = (n + "").split("");
	var max,
		temp,
		front,
		back,
		result,
		i,
		j;

	for(i = arr.length - 1; i > 0; i--) {
		if(+arr[i] < +arr[i - 1]){
			break;
		}
	}

	if(i === 0) {
		return -1;
	}

	max = i;

	for(j = i + 1; j < arr.length; j++) {
		if(+arr[j] > +arr[i] && +arr[j] < +arr[i - 1]) {
			max = j;
		}
	}

	temp = arr[i - 1];
	arr[i - 1] = arr[max];
	arr[max] = temp;

	front = arr.slice(0, i);
	back = arr.slice(i, arr.length);

	back.sort(function(a, b) {
		return b - a;
	});

	result = +front.concat(back).join('');
	if(arr.length > (result + "").length){
		return -1;
	}else{
		return result;
	}
}