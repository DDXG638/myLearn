/* const export1 = require('./export1');
const export2 = require('./export2');

console.log('index.js');

export1();

export2(); */

class Parent {
    static sayAge() {
        return this.age
    }
    constructor(name, age) {
        this.name = name
        this.age = age
    }
    sayName() {
        return this.name
    }
}

class Child extends Parent {
    constructor(name, age, money) {
        super(name, age)
        this.money = money
    }
    sayMoney(){
        return super.sayName() + '-' + super.sayAge() + '-' + this.money
    }
}

let c1 = new Child('ddd', 25, 5555)
c1.sayMoney()
