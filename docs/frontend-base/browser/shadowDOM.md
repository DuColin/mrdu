# shadow DOM

Shadow DOM 是浏览器提供的一套“DOM 作用域隔离机制”。

## 什么是 shadow DOM

Shadow DOM 给普通 DOM 增加了一层“私有作用域”。

```text
Document
└── html
    └── body
        └── div#app
            └── #shadow-root (open)
                ├── style
                └── button
```

在上面的 DOM 树中：
- `div#app` 是宿主元素（Host）。
- `shadow Root` 是影子根。
- 里面的 DOM 是 Shadow Tree。

shadow DOM 的创建方式：

```js
const host = document.querySelector('#app');
const shadowRoot = host.attachShadow({ mode: 'open' });

shadowRoot.innerHTML = `
  <style>
    button {
      color: white;
      background: blue;
    }
  </style>
  <button class="shadow-button">点击我</button>
`;
```


##### 它到底隔离了什么？

- CSS 样式

    - Shadow DOM 内部的样式仅作用于 shadow Tree, 不会影响到外部 DOM。
    - 外部 DOM 的样式也不会影响到 Shadow DOM。

- DOM 查询隔离

    Shadow DOM 只隔离“外部访问内部”, 但是不完全阻止“内部访问外部”。
    
    - `mode: 'open'`: 内部可以访问外部。
    - `mode: 'closed'`: 内部不能访问外部。


    例子中是 `mode: 'open'` 的情况。

    ```js
    // 找不到 Shadow DOM 里的按钮
    document.querySelector('.shadow-button');
    // 通过宿主元素访问内部
    const host = document.querySelector('#app');
    host.shadowRoot.querySelector('.shadow-button');
    // 内部查询外部 DOM
    const external = document.querySelector('#app');
    ```

- 事件重定向

    Shadow DOM 内部的事件依然遵循着事件传播的三个过程：
    ```text
    捕获阶段 → 目标阶段 → 冒泡阶段
    ```

    内部事件可以穿越边界传播，但是否能穿越，取决于事件的 `composed` 属性（自定义事件可以设置该属性）。
    - 常见的可以穿越的事件：`click`、`mousedown`、`mouseup`、`input` 等。
    - 不可穿越的事件：`mouseenter`、`mouseleave`。

    事件重定向指的 `event.target` 属性在内部和外部指向是不一样的：在内部指向实际触发事件的元素，在外部指向宿主元素。

## 为什么需要 shadow DOM

因为真正的组件化必须满足三个条件：

1. 结构封装：内部DOM 不应该依赖外部 DOM。
2. 样式封装：内部样式不应该影响外部样式，外部样式不应该污染内部样式。
3. 行为封装：事件暴露的是“组件行为”，不是内部实现细节。

传统的 DOM 无法满足这三个条件，所以才有了 shadow DOM。
