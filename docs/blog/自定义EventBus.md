# 自定义Event Bus

Event Bus（事件总线）通常被用于两个独立组件间的通信。在软件开发中，为了提高代码的复用性，通常在业务实现的过程中，会根据业务逻辑或者代码架构将代码拆分为独立的可复用模块，例如无论是Vue框架还是React框架，都将构建组件化的应用程序作为其实现的目标，然后将组件组合成一颗组件树来构建完整的应用程序。但是当两个组件间距离过远（处于不同分支或者嵌套过深时），这时就需要一个Event Bus来实现它们的通信，以此降低代码的复杂度。

Event Bus本身就是通过发布-订阅模式来进行两个组件的通信，事件总线需要三个方法：`on`、`dispatch`和`remove`。

```javascript
const eventBus = {
  on() {
    //...
  },
  dispatch() {
    //...
  },
  remove() {
    //...
  }
};
```

- `on()`方法在`document`对象上注册一个事件监听。

  ```javascript
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  }
  ```

- `dispath()`方法用于触发事件。

  ```javascript
  function dispatch(event, data) {
      document.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
  ```

- `remove()`方法用于将事件监听从`document`对象上移除，防止内存泄露。

  ```javascript
  function remove(event, callback) {
      document.removeEventListener(event, callback);
  }
  ```

接下来，通过下面的完整示例，说明Event Bus的使用。

```javascript
const eventBus = {
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },
  dispatch(event, data) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event, callback) {
    document.removeEventListener(event, callback);
  },
};

export default eventBus;
```

