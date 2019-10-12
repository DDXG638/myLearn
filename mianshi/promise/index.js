// promise的使用
const num = 2

/* let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        num > 5 ? resolve(num) : reject(new Error('num小于5'))
    }, 1500)
})

p1.then(resolve => {
    console.log('resolve', resolve);
    return resolve + 1
})
.then(resolve => {
    console.log('resolve+1', resolve);
})
.catch(err => console.error(err)) */

/**
 * 实现简易的promise
 * see: https://zhuanlan.zhihu.com/p/49060073
 */

const PENDING = 1 // 进行中
const FULFILLED = 2 // 已完成
const REJECTED = 3 // 已失败

class DPromise {
    constructor(callback) {
        // 记录promise的状态
        this.state = PENDING
        // resolve回调数组
        this.resolveCbs = []
        // reject回调数组
        this.rejectCbs = []
        // 储存reject的错误信息
        this.reason = null
        // 存储resolve的返回值
        this.result = null

        // 一开始我将resolve 和 reject 方法写成了DPromise的成员函数的位置，后来运行报错了，
        // this指向错误，因为这两个函数是以参数的形式提供给callback调用的，
        // 在外面调用这两个函数的时候this指向的不是DPromise，所以函数里面使用this的地方都会出错
        let resolve = value => {

            /**
             * 这里必须要使用异步操作，我这里简单地使用setTimeout代替，
             * 用户在new Promise的时候很可能写的是同步代码，如果这里没有处理的话，同步代码就会在then方法之前执行了
             * 没有先执行then方法的话，同步代码执行的时候下面的resolveCbs数组就会是空的，就无法执行resolve回调函数，
             * 这个promise写了跟没写一样
             */
            setTimeout(() => {
                // 只有状态为PENDING才能转换为FULFILLED
                if (this.state === PENDING) {
                    this.state = FULFILLED

                    this.result = value
                    // 调用resolve数组中的回调函数
                    this.resolveCbs.forEach(item => {
                        this.result = item(this.result)
                    })
                }
            }, 0)
        }

        let reject = error => {
            setTimeout(() => {
                // 只有状态为PENDING才能转换为REJECTED
                if (this.state === PENDING) {
                    this.state = REJECTED
                    this.reasen = error

                    // 调用resolve数组中的回调函数
                    this.rejectCbs.forEach(item => {
                        this.reasen = item(this.reasen) || null
                    })
                }
            }, 0)
        }

        callback(resolve, reject)
    }

    // Promise.all方法
    static all(promises) {

        let values = [];
        const len = promises.length;
        let count = 0;

        return new DPromise((resolve, reject) => {
            
            promises.forEach((promise, index) => {
                promise.then(res => {
                    count++;
                    console.log(res)
                    // 存储当前promise的结果
                    values[index] = res;

                    // 如果所有的promise实例都成功返回，则resolve
                    count === len && resolve(values);
                }, err => {
                    // 值要有一个promise实例reject了，整个all也reject
                    reject(err)
                })
            })
        })
    }

    then(resolve, reject) {
        // 校验一下是否为方法
        typeof resolve === 'function' && this.resolveCbs.push(resolve)
        typeof reject === 'function' && this.rejectCbs.push(reject)

        // 链式调用，先直接返回this，以后再完善
        return this
    }

    catch(cb) {
        typeof cb === 'function' && this.rejectCbs.push(cb)
    }
}


let p1 = new DPromise((resolve, reject) => {
    setTimeout(() => {
        num > 5 ? resolve(num) : reject(new Error('num小于5'))
    }, 1500)
})

/* p1.then(resolve => {
    console.log('resolve', resolve);
    return resolve + 1
}, err => {
    console.error(err)
})
.then(res => console.log('res2', res))
.catch(err => console.log('--error--', err)) */

// --------测试DPromise.all
let p2 = new DPromise(resolve => {
    resolve(2)
})

let p3 = new DPromise(resolve => {
    setTimeout(() => {
        resolve(3)
    }, 1000)
})

let p4 = new DPromise(resolve => {
    setTimeout(() => {
        resolve(4)
    }, 3000)
})

DPromise.all([p2, p3, p4])
.then(res => {
    console.log('promise.all-resolve', res)
})
.catch(err => {
    console.log('promise.all-err', err)
})
