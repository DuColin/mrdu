# Vue中的代码技巧

## 问答篇

### 为什么vue中的data必须是函数？

为了组件的复用。如果data是一个对象，那么当组件在多个地方复用时，data都会指向一个对象，造成干扰。而data如果是一个函数，则返回的对象会指向不同的地址。就不会造成干扰。



## 技巧篇

### 实例化判断

在Vue的构造函数里，开头有这样一段代码。

```javascript
if (!this instanceof Vue) {
    warn('Vue is a constructor and should be called with the 'new' keyword);
}
```

我们知道instanceof 运算符用于判断“构造函数的prototype属性是否出现在指定对象的原型链上”，在这里就可以判断this是不是Vue这个构造函数的实例。而一个函数内部的this指向是由函数的调用者决定的，函数由谁调用则this就指向谁。所以这里就可以判断this是通过new关键字调用，还是直接通过Vue()调用。当不是通过new关键字去创建Vue实例的时候就发出errors。



## 工具类篇

### 缓存函数及工程中的缓存思想

### 连字符拼接的字符串转化为驼峰写法

