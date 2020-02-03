interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    return {
        color: 'red',
        area: 123
    }
}

createSquare({ color: "red", width: 100, text: '456789' });

interface Person {
    readonly name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};

// 数组
interface NumberArray {
    [index: number]: number;
}
let arr: NumberArray = [1, 3, 4]
let arr2: number[] = [1, 56, 6]
let arr3: Array<number> = [1, 56, 6]

// 函数
function sum (a: number, b: number): number {
    return a + b
}
sum(1, 2)

let sum2: (x: number, y: number) => number = function (a: number, b: number): number {
    return a + b
}
sum2(2, 3)

function buildName(firstName: string = 'Tom', lastName: string) {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let cat = buildName(undefined, 'Json');

// 重载
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}

reverse(123456)

class Car {
    private name: 'ddd';

    constructor (name) {
        this.name = name
    }

    sayHi () {
        console.log(this.name)
    }
}


// 混合类型
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

var c = getCounter();
c(10);
c.reset();
c.interval = 5.0;

// 泛型
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray<string>(2, '78')