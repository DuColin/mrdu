# 常用的 hook

在 React 函数，组件内的所有代码都会重新执行，包括那些计算量大的逻辑。如果计算开销大，
就可能导致性能问题。

## `useEffect`

`useEffect` 用于在函数组件中处理副作用。

> 在 React 中，副作用（Side Effects） 指的是组件渲染时产生的与 UI 直接无关的操作，比如
>
> -   网络请求（获取数据）
> -   手动操作 DOM
> -   订阅和取消订阅事件
> -   定时器（setTimeout、setInterval）
> -   日志记录
> -   存储数据到 localStorage 或 sessionStorage
> -   清理资源（如 WebSocket 连接、监听器等）
>
> 这些操作之所以称为副作用，是因为它们并不会直接影响组件的 UI 渲染逻辑，而是发生在**渲染后**，影响外部系统或状态。

-   **语法**

    ```javascript
    useEffect(setup, dependencies?)
    ```

    你需要向 `useEffect` 传递两个参数：

    1. 一个 **setup 函数** ，其 `setup` 代码 用来连接到该系统。
        - 它应该返回一个 **清理函数**（cleanup），其 `cleanup` 代码 用来与该系统断开连接。
    2. 一个 **依赖项列表**，包括这些函数使用的每个组件内的值。

-   **示例**

    ```javascript
    import { useState, useEffect } from "react";
    import { createConnection } from "./chat.js";

    function chatRoot(roomId) {
        const [serverUrl, setSeverUrl] = useState("https://loclhost:8080");

        useEffect(() => {
            // setup
            const connection = createConnection(severUrl, roomId);
            connection.connect();
            return () => {
                // clean up
                connection.disconnect();
            };
            // dependencies
        }, [serverUrl, roomId]);
    }
    ```

-   **依赖项**

    1. 你无法 “选择” `Effect` 的依赖项。`Effect` 代码中使用的每个 **响应式值** 都必须声明为依赖项。
    2. 没有依赖数组和使用空数组 `[]` 作为依赖数组，行为是不同的。
        - 如果指定了依赖项，则 `Effect` 在 **初始渲染后以及依赖项变更的重新渲染后** 运行。
            ```javascript
            useEffect(() => {
                /**
                 * 这里的代码不但会在组件挂载时运行，
                 * 而且当 a 或 b 的值自上次渲染后发生变化后也会运行
                 */
            }, [a, b]);
            ```
        - 如果你的 `Effect` 确实没有使用任何响应式值，则它仅在 **初始渲染后** 运行。
            ```javascript
            useEffect(() => {
                // 这里的代码只会在组件挂载（首次出现）时运行
            }, []);
            ```
        - 如果完全不传递依赖数组，则 Effect 会在组件的 **每次渲染之后** 运行。
            ```javascript
            useEffect(() => {
                // 这里的代码会在每次渲染后运行
            });
            ```

-   **清理函数**

    React 在必要时会调用 `setup` 和 `cleanup`，这可能会发生多次：

    1. 将组件**挂载** 到页面时，将运行 `setup` 代码。
    2. 重新渲染 **依赖项** 变更的组件后：
        - 首先，使用旧的 `props` 和 `state` 运行 `cleanup` 代码。
        - 然后，使用新的 `props` 和 `state` 运行 `setup` 代码。
    3. 当组件从页面 **卸载** 后，`cleanup` 代码 将运行最后一次。

## `useCallback`

`useCallback` 用于缓存函数的引用，防止函数在每次组件渲染时都被重新创建。

## `useMemo`

`useMemo` 用于缓存计算结果，避免在组件每次渲染时不必要的重复计算。

-   **语法**

-   **语法**

## `useState`

## `useReduce`

## `useRef`

`useRef` 用于创建可变的引用对象。它在组件的整个生命周期内保持不变，并且不会触发组件重新渲染。

-   **语法**

    ```javascript
    const refContainer = useRef(initialValue);
    ```

    -   参数
        - `initialValue`：`ref` 对象的 `current` 属性的初始值。可以是任意类型的值。这个参数在首次渲染后被忽略。
    -   返回值
        - `useRef` 返回一个只有包含`current`属性的对象: 初始值为传递的 `initialValue`。之后可以将其设置为其他值。

    在后续的渲染中，`useRef` 将返回同一个对象。

-   **`useRef` 的特点：**

    1.  可以在重新渲染之间存储信息（普通对象存储的值每次渲染都会重置）。
    2.  改变它不会触发重新渲染（状态变量会触发重新渲染）。
    3.  对于组件的每个副本而言，这些信息都是本地的（外部变量则是共享的）。

-   **`useRef` 主要有两个核心用途：**

    1. 获取 DOM 元素的引用（类似于 document.getElementById）。
        ```javascript 
        import { useRef, useEffect } from "react";

        function InputFocus() {
        const inputRef = useRef(null);

        useEffect(() => {
            inputRef.current.focus(); // 组件加载时自动聚焦
        }, []);

        return <input ref={inputRef} placeholder="自动聚焦输入框" />;
        }

        export default InputFocus;

        ```
    2. 在组件渲染间存储可变值，而不触发组件重新渲染。
