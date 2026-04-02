# 手写js原生函数

### 手写bind

```javascript
Function.prototype.bind = function (context) {
    if (typeof this !== 'function') {
        throw new Error('Function.prototype.bind - what is trying to be bound is not callable')
    }

    let self = this;
    const args = Array.prototype.slice.call(arguments, 1);

    return function () {
        const bindArgs = arguments;

        self.call(contenxt, args.concat(bindArgs));
    }
}
```

### 手写Promise

```javascript
class Promise {

    contructor(excutor) {
        this.promiseResult = null;
        this.promiseState = 'pending';

        try {
            excutor(this.resolve, this.reject);
        } catch (e) {
            this.reject(e);
        }
    }

    resolve(value) {
        if (this.promiseState !== 'pending') return;

        this.promiseState = 'rejected';
        this.promiseResult = value;
    }

    reject(reason) {
        if (this.promiseState !== 'pending') return;
        
        this.promiseState = 'fulfilled';
        this.promiseResult = reason;
    }

}
```