# Hooks

hooks 的核心作用就是：复用组件逻辑。

hooks 使用的两大黄金法则：

- 只在最顶层调用 Hook：不要在循环、条件或嵌套函数里调用 Hook。React 通过调用顺序来匹配状态，顺序变化会导致状态错位。
- 只在 React 函数组件或自定义 Hook 中调用 Hook：不要在普通函数里直接调用。

## 状态管理类 Hooks

### `useState`

`useState` 是一个状态钩子，它允许你在函数组件中声明和管理内部状态。

- 持久化存储：它创建的状态变量会被 React “记住”，在多次渲染之间保持不变。
- 触发更新：当你调用 setState 函数时，React 会知道状态发生了变化，并自动重新执行整个组件函数，用新的状态值来渲染 UI。这就是“数据驱动视图”的核心。


##### 语法说明

```js
import { useState } from 'react';

function MyComponent() {
  // 语法：const [状态变量, 设置状态的函数] = useState(初始值);
  const [count, setCount] = useState(0);

  return (
    <div>
        <p>你点击了 {count} 次</p>
        <button onClick={() => setCount(count + 1)}>
            点击我
        </button>
    </div>
  );
}
```


- 参数：

    - `initialState`：初始状态值。可以是普通变量或者函数。

- 返回值

    `useState` 返回一个由两个值组成的数组：
    - `state`: 当前状态值
    - `setState`: 更新状态值的函数

##### 更新状态的两种模式

1. 直接传入新值
    
    适用于新状态不依赖于旧状态的情况。

    ```js

    // 重置计数器
    setCount(0);

    // 切换布尔值
    setIsVisible(true);

    ```

2. 函数式更新

    **强烈推荐**当新状态依赖于旧状态时使用。这可以避免因异步更新导致的“闭包陷阱”，确保你拿到的是最新的状态值。

    ```js
    // 正确：连续点击两次，count 最终会 +2
    const handleClick = () => {
        setCount(prevCount => prevCount + 1);
        setCount(prevCount => prevCount + 1);
    };

    // 错误：连续点击两次，count 最终只会 +1
    const handleClick = () => {
        setCount(count + 1);
        setCount(count + 1); // 这里的 count 还是旧值
    };
    ```

##### 处理复杂状态：对象或数组

`useState` 的更新是直接替换，而不是合并。因此，对于对象或数组，你需要手动创建一个新的副本来更新。

```js 
// 对象状态
const [user, setUser] = useState({ name: 'Alice', age: 25 });

// ✅ 正确：创建一个新对象，展开旧属性，覆盖要修改的
setUser({ ...user, age: 26 });

// ❌ 错误：直接修改原对象，React 无法检测到变化
user.age = 26;
setUser(user); // 不会触发重新渲染！

// 数组状态
const [list, setList] = useState([1, 2, 3]);

// ✅ 添加元素：创建新数组
setList([...list, 4]);

// ✅ 删除元素：使用 filter 创建新数组
setList(list.filter(item => item !== 2));

```


##### 性能优化：惰性初始化

如果状态的初始值需要通过复杂的计算才能得到，你可以传入一个函数。这个函数只会在组件首次渲染时执行一次，避免后续重复渲染时的不必要计算。

```js
// 普通初始化：每次渲染都会执行 getInitialValue()
const [data, setData] = useState(getInitialValue());

// 惰性初始化：仅在首次渲染时执行 getInitialValue()
const [data, setData] = useState(() => {
  const initialValue = getInitialValue(); // 复杂计算
  return initialValue;
});
```

##### 注意事项

1. 异步批量更新：在 React 合成事件（如 onClick）中，多次调用 setState 会被合并为一次渲染，以提高性能。因此，在调用 setState 后立即读取状态，得到的仍然是旧值。

2. 状态是隔离且私有的：如果你在同一个页面渲染了两个相同的组件，它们各自的状态是完全独立的，互不影响。


### `useReducer`

`useReducer` 是 `useState` 的进阶替代方案。当你的状态逻辑变得复杂，比如状态包含多个子值，或者下一个状态依赖于前一个状态，或者更新逻辑比较分散时，`useReducer` 就能大显身手。


##### 语法说明


它借鉴了 Redux 的设计思想，将状态更新的逻辑集中到一个名为 `reducer` 的纯函数中。这个函数接收当前状态和一个描述“发生了什么”的 `action`（动作），然后返回一个新的状态。

```js
import { useReducer } from 'react';

// 1. 定义 reducer 函数（纯函数）
function reducer(state, action) {
  switch (action.type) {
        case 'increment':
            return { count: state.count + 1 };
        case 'decrement':
            return { count: state.count - 1 };
        case 'reset':
            return { count: action.payload }; // 通过 payload 传递额外数据
        default:
            throw new Error('未知的 action type');
    }
}

// 2. 初始状态
const initialState = { count: 0 };

function Counter() {
  // 3. 使用 useReducer
  // 语法：const [当前状态, 分发动作的函数] = useReducer(reducer, 初始状态);
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
        <p>计数: {state.count}</p>
        {/* 4. 通过 dispatch 发送 action 来更新状态 */}
        <button onClick={() => dispatch({ type: 'increment' })}>+</button>
        <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
        <button onClick={() => dispatch({ type: 'reset', payload: 0 })}>重置</button>
    </div>
  );
}
```

函数签名：

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

- 参数
    - `reducer`: 一个纯函数，用于处理状态更新。
    - `initialArg`: `state` 的初始值。它的使用方式取决于第三个参数 `init` 是否存在。

        - 没有 `init` 函数时：`initialArg` 直接作为 `state` 的初始值。
        - 有 `init` 函数时：`initialArg` 会作为参数传递给 `init` 函数，`init` 函数的返回值才是真正的初始 `state`。

    - `init`: 一个可选的初始化函数，用于惰性计算初始状态。它接收 initialArg 作为参数，并返回计算后的初始状态。。

- 返回值

    返回一个包含两个元素的数组，通过解构赋值获取：

    - `state`：当前的状态值。
    - `dispatch`：一个分发函数。调用 `dispatch(action)` 是触发状态更新的唯一方式。React 会将 `action` 和当前 `state` 一起传给 `reducer` 函数，并用 `reducer` 返回的新状态来更新组件。


##### 为什么 `reducer` 必须是纯函数？

这是 `useReducer` 乃至整个 React 状态管理哲学的基石。

- 可预测性：给定相同的 `state` 和 `action`，`reducer` 必须返回完全相同的 `newState`。这使得状态变化是可预测、可追溯的。
- 可测试性：你可以轻松地为 `reducer` 编写单元测试，无需渲染组件。
- 无副作用：`reducer` 内部不能有 API 请求、修改 DOM、生成随机数等副作用。副作用应该在组件的事件处理函数或 `useEffect` 中处理。


##### 性能优化：惰性初始化

当初始状态的计算成本很高（例如从 `localStorage` 读取大量数据）时，可以使用惰性初始化。`useReducer` 接受一个可选的第三个参数——初始化函数。

```js
// 初始化函数
function init(initialCartItems) {
  // 这里可以执行复杂计算，比如从 localStorage 恢复数据
  const storedItems = JSON.parse(localStorage.getItem('cart')) || [];
  return {
    items: storedItems,
    totalAmount: storedItems.reduce((sum, item) => sum + item.price, 0),
  };
}

// 使用：第三个参数是 init 函数，第二个参数会作为 init 函数的参数
const [cartState, dispatch] = useReducer(cartReducer, [], init);
// 等价于：const [cartState, dispatch] = useReducer(cartReducer, init([]));
```


##### 注意事项

- `dispatch` 是异步的：调用 `dispatch` 后，状态不会立即更新。在下一行代码中读取 `state`，得到的仍然是旧值。
- `reducer` 必须返回新对象：永远不要直接修改 `state` 参数。使用展开运算符 `...` 或 `Object.assign` 创建新对象。
- `init` 函数只执行一次：它只在组件首次渲染时被调用，后续渲染不会执行，这是性能优化的关键。
- 严格模式下的双重调用：在开发模式的严格模式下，React 会调用两次 `reducer` 和 `init` 函数，以帮助你发现意外的副作用。这不会影响生产环境。


## 副作用处理类 Hooks

这是 Hooks 最重要的能力之一。函数组件本身应该是纯函数（输入 Props，输出 UI），但现实中我们需要：

-   网络请求：获取数据。
-   手动操作 DOM ：如集成 D3.js 或 Echarts。
-   订阅/监听：如 `windown.addEventListener`。
> -   定时器（setTimeout、setInterval）

在 React 函数，组件内的所有代码都会重新执行，包括那些计算量大的逻辑。如果计算开销大，就可能导致性能问题。

### `useEffect`

理解它需要把握三个核心：执行时机、依赖数组和清理函数。

##### 语法说明

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

签名：

```javascript
useEffect(setup, dependencies?)
```

- 参数：
    - `setup`: 一个函数，包含副作用逻辑。可以返回一个清理函数。
    - `dependencies`: 一个依赖项列表 ，`Effect` 代码中使用的每个 **响应式值** 都**必须**声明为依赖项（props、state 等）。不传依赖项和
        空数组依赖会影响 `setup` 的运行，这点在后面说明。

- 返回值：无返回值

 

##### 执行时机：渲染之后

这是理解 `useEffect` 的第一条铁律：`useEffect` 在浏览器完成布局和绘制之后执行。

这意味着：
- 渲染优先：React 先执行组件函数，生成虚拟 DOM，同步到真实 DOM。
- 副作用延后：`useEffect` 中的代码不会阻塞浏览器绘制，确保用户能尽快看到 UI。


##### 依赖数组：控制执行频率

依赖数组是 useEffect 的灵魂，它决定了副作用何时执行。

| 依赖数组        | 执行时机           | 场景示例 |
| :------------- | :------------------| :--- |
| 不传           | 每次渲染后都执行      | 日志记录、调试 |
| `[]`           | 只在首次渲染后执行一次 |  初始化数据请求、设置一次性事件监听 |
| `[dep1, dep2]` | 首次渲染后执行，且依赖项变化重新渲染后执行 | 根据 `cityId` 重新获取天气数据 |


##### 清理函数：防止内存泄漏

`setup` 函数可以返回一个清理函数，它在以下时机执行：
- 组件卸载时：清理定时器、取消订阅、移除事件监听。
- 副作用重新执行前：先清理旧的副作用，再执行新的。
 
```js
function TemperatureMonitor() {
  const [temperature, setTemperature] = useState(26);

  useEffect(() => {
    // 副作用：每秒更新一次温度
    const interval = setInterval(() => {
      setTemperature(prev => prev + (Math.random() - 0.5) * 2);
    }, 1000);

    // 清理函数：组件卸载或依赖变化时清除定时器
    return () => {
      clearInterval(interval);
      console.log('定时器已清除，避免内存泄漏');
    };
  }, []); // 空依赖，只在挂载时设置定时器

  return <div>当前室温：{temperature.toFixed(1)}°C</div>;
}
```

##### 注意事项

- **陷阱一：闭包陷阱（过时值）**

    ```js
    function Counter() {
        const [count, setCount] = useState(0);

        useEffect(() => {
            const interval = setInterval(() => {
            console.log(count); // 总是 0，因为闭包捕获了初始值
            setCount(count + 1);
            }, 1000);
            return () => clearInterval(interval);
        }, []); // 空依赖，count 不会更新
    }
    ```
    **为什么**：

    - 组件首次渲染，`count = 0`。
    - `useEffect` 执行，创建了一个闭包，这个闭包捕获了 `count = 0`。
    - `setInterval` 的回调函数在 1 秒后执行，它读取的是闭包中的 `count`，也就是 0。
    - 即使组件因为 `setCount` 重新渲染了，新的渲染创建了新的闭包（其中 `count = 1`），但 `setInterval` 的回调函数仍然引用的是第一次渲染时创建的旧闭包，所以它读取的 `count` 永远是 0。

    **解决方案**：
    - 函数式更新：`setCount(prev => prev + 1)`，不依赖外部 `count`。
    - 添加依赖：`[count]`，但会导致定时器频繁重建。
    - 使用 `useRef`：用 `useRef` 保存最新值，定时器回调中读取 `ref.current`。

- **陷阱二：无限循环**

    ```js
    useEffect(() => {
        setCount(count + 1); // 更新状态 -> 重新渲染 -> 再次执行 effect -> 无限循环
    }, [count]); // count 变化触发 effect，effect 又改变 count
    ```

    **解决方案**：检查依赖项，确保 effect 中更新的状态不在依赖数组中，或使用函数式更新。

- **陷阱三：对象/函数作为依赖**

    ```js
    function Parent() {
        const options = { threshold: 0.5 }; // 每次渲染都是新对象

        useEffect(() => {
            // 每次渲染都会执行，因为 options 引用不同
        }, [options]);
    }
    ```
    **解决方案**：使用 useMemo 或 useCallback 缓存依赖项。

### `useLayoutEffect`

它和 `useEffect` 几乎一模一样，但有一个关键区别：执行时机。

##### 语法说明

它的函数签名和 `useEffect` 完全一致。

```js
useLayoutEffect(setup, dependencies?)

```

##### 执行时机：绘制之前

要理解 `useLayoutEffect`，必须先理解 React 的渲染流程：

```text
1. Render 阶段：生成虚拟 DOM，计算变更
2. Commit 阶段：
   ├── Before Mutation：DOM 操作前
   ├── Mutation：执行 DOM 更新
   ├── Layout：DOM 更新后，浏览器绘制前 ← useLayoutEffect 在此执行
   └── 浏览器绘制：将像素输出到屏幕
3. useEffect 执行：浏览器绘制后
```

关键区别：
| Hook | 执行时机 | 是否阻塞绘制 |
| :--- | :--- | :--- |
| `useEffect` | 浏览器绘制之后（异步） | 不阻塞 |
| `useLayoutEffect` | DOM 更新后、绘制之前（同步） | 阻塞 |


##### 核心使用场景

- 场景一：避免视觉闪烁（FOUC）

    这是 `useLayoutEffect` 最经典的应用场景。当你需要在 DOM 更新后立即修改样式，且不希望用户看到中间状态时。

- 场景二：获取真实 DOM 元素尺寸（避免抖动）

    当你需要读取 DOM 元素的尺寸或位置，并基于这些信息进行布局时。

##### 注意事项

1. **不要滥用**
    
    `useLayoutEffect` 是同步执行的，会阻塞浏览器绘制。如果其中的操作耗时过长，用户会感觉到页面卡顿。
    原则：优先使用 `useEffect`，只有在需要避免视觉闪烁或同步测量 DOM 时才使用 `useLayoutEffect`。

2. **服务端渲染（SSR）兼容**
    
    `useLayoutEffect` 在服务端会触发警告，因为服务端没有 DOM。解决方案是创建一个同构 Hook：
    ```js
    const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;
    ```

3. **避免耗时操作**

    耗时操作会阻塞浏览器绘制，导致页面卡顿。

## 性能优化类 Hooks

### `useMemo`

`useMemo` 用于缓存计算结果，避免在组件每次渲染时不必要的重复计算。

##### 语法说明

```js
const cachedValue = useMemo(calculateValue, dependencies);
```

- 参数

    - `calculateValue`：一个纯函数，返回需要缓存的值。它不应该有副作用。

    - `dependencies`：依赖项数组，React 使用 `Object.is` 比较每个依赖项。

- 返回值

    - `cachedValue`：首次渲染时，返回 calculateValue 的执行结果。后续渲染中，如果依赖项没变，直接返回上次缓存的值；如果依赖项变了，重新执行 calculateValue 并返回新值。

##### 核心机制：什么时候重新计算？

```js
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b);
}, [a, b]);
```

执行逻辑：
- 首次渲染：执行 expensiveCalculation(a, b)，缓存结果。
- 后续渲染：
    
    - 如果 a 和 b 都没变（`Object.is` 比较）→ 直接返回缓存值，不执行计算函数。
    - 如果 a 或 b 变了 → 重新执行计算函数，更新缓存。

##### 核心使用场景

- 场景一：跳过昂贵的计算

    这是 `useMemo` 最直接的应用。当计算涉及大量数据或复杂逻辑时。

    ```js
    function WeatherDashboard({ temperatureData, filter }) {
        // ❌ 每次渲染都重新计算，即使数据没变
        const filteredData = temperatureData.filter(item => item > filter);

        // ✅ 使用 useMemo 缓存过滤结果
        const filteredData = useMemo(
            () => temperatureData.filter(item => item > filter),
            [temperatureData, filter]
        );

        // 更复杂的计算：计算立夏以来的平均温度
        const averageTemp = useMemo(() => {
            console.log('计算平均温度...');
            const sum = filteredData.reduce((acc, temp) => acc + temp, 0);
            return sum / filteredData.length;
        }, [filteredData]);

        return (
            <div>
            <p>西安立夏平均温度：{averageTemp.toFixed(1)}°C</p>
            <ul>
                {filteredData.map((temp, index) => (
                <li key={index}>{temp}°C</li>
                ))}
            </ul>
            </div>
        );
    }
    ```

    当组件因为其他状态（如用户点击按钮）重新渲染时，只要 `temperatureData` 和 `filter` 没变，过滤和平均计算都不会重复执行。

- 稳定引用类型

    这是 `useMemo` 的另一个重要用途——保持对象/数组的引用稳定，避免子组件不必要地重新渲染。

    ```js

    function WeatherWidget({ city, unit }) {
        // ❌ 每次渲染都创建新对象，导致子组件重新渲染
        const config = {
            city,
            unit,
            lang: 'zh-CN',
            refreshInterval: 30000,
        };

        // ✅ 使用 useMemo 保持引用稳定
        const config = useMemo(
            () => ({
            city,
            unit,
            lang: 'zh-CN',
            refreshInterval: 30000,
            }),
            [city, unit] // 只有 city 或 unit 变化时才创建新对象
        );

        return <WeatherChart config={config} />;
    }

    // 子组件使用 React.memo 优化
    const WeatherChart = React.memo(function WeatherChart({ config }) {
        // 只有当 config 引用变化时才重新渲染
        return <div>显示 {config.city} 的天气</div>;
    });
    ```

    当父组件因为其他原因重新渲染时，只要 `city` 和 `unit` 没变，`config` 的引用保持不变，`WeatherChart` 就不会重新渲染。

- 场景三：与 `useEffect` 配合

    当 `useEffect` 的依赖项是对象或数组时，`useMemo` 可以避免 `useEffect` 频繁执行。

    ```js
    function SearchResults({ query, page }) {
        // 使用 useMemo 创建稳定的依赖项
        const searchParams = useMemo(
            () => ({ query, page, timestamp: Date.now() }),
            [query, page] // 注意：timestamp 每次都会变，所以这里不能加
        );

        useEffect(() => {
            fetch(`/api/search?q=${query}&page=${page}`)
            .then(res => res.json())
            .then(data => setResults(data));
        }, [searchParams]); // 依赖稳定的对象引用

        return <div>搜索结果</div>;
    }
    ```

### `useCallback`

`useCallback` 用于缓存函数的引用，只有当依赖项发生变化时才重新创建函数。

##### 语法说明


```js
const memoizedCallback = useCallback(callback, dependencies);
```

- 参数

    - `callback`：需要缓存的函数。
    - `dependencies`：依赖项数组，React 使用 `Object.is` 比较每个依赖项。
    
- 返回值

    - `memoizedCallback`：首次渲染时，返回传入的 fn。后续渲染中，如果依赖项没变，直接返回上次缓存的函数（同一个引用）；如果依赖项变了，返回新传入的 fn。


##### 核心机制：为什么需要缓存函数？

在 React 中，每次组件重新渲染，所有内部定义的函数都会被重新创建。

```js
function Parent() {
  // 每次渲染都创建一个新的 handleClick 函数
  const handleClick = () => {
    console.log('按钮被点击');
  };

  return <Child onClick={handleClick} />;
}
```

问题在于：即使函数逻辑完全一样，每次渲染创建的也是不同的函数对象（不同引用）。这会导致：

- `React.memo` 失效：子组件接收的 `onClick prop` 每次都是新引用，`React.memo` 的浅比较认为 `prop` 变了，导致子组件重新渲染。
- `useEffect` 频繁执行：如果函数是 `useEffect` 的依赖项，每次渲染都会触发 `effect` 重新执行。

##### 核心使用场景

- 场景一：配合 `React.memo` 避免子组件不必要渲染

    ```js
    import React, { useState, useCallback } from 'react';

    // 子组件：空调温度显示
    const TemperatureDisplay = React.memo(function TemperatureDisplay({ onIncrease }) {
        console.log('🔄 TemperatureDisplay 重新渲染');
        return (
            <div>
            <p>当前温度：26°C</p>
            <button onClick={onIncrease}>升温</button>
            </div>
        );
    });

    function AirConditionerPanel() {
        const [mode, setMode] = useState('cool'); // 制冷/制热
        const [temperature, setTemperature] = useState(26);

        // ❌ 不使用 useCallback：每次渲染都创建新函数
        const handleIncrease = () => {
            setTemperature(prev => prev + 1);
        };

        // ✅ 使用 useCallback：只有 temperature 变化时才创建新函数
        const handleIncrease = useCallback(() => {
            setTemperature(prev => prev + 1);
        }, []); // 函数式更新不需要依赖

        return (
            <div>
            <p>模式：{mode === 'cool' ? '制冷' : '制热'}</p>
            <button onClick={() => setMode(mode === 'cool' ? 'heat' : 'cool')}>
                切换模式
            </button>
            <TemperatureDisplay onIncrease={handleIncrease} />
            </div>
        );
    }
    ```

    执行效果：
    - 不用 `useCallback`：点击“切换模式”按钮 → `mode` 变化 → 父组件重新渲染 → 创建新的 `handleIncrease` → `TemperatureDisplay` 的 `onIncrease` prop 引用变化 → 子组件重新渲染（即使温度没变）。
    - 用 `useCallback`：点击“切换模式”按钮 → `mode` 变化 → 父组件重新渲染 → `handleIncrease` 引用不变（空依赖） → `TemperatureDisplay` 不重新渲染。

- 场景二：作为`useEffect` 的稳定依赖

    当函数是 useEffect 的依赖项时，useCallback 可以避免 effect 频繁执行。

    ```js
    function WeatherMonitor({ cityId }) {
        const [weather, setWeather] = useState(null);

        // ❌ 不用 useCallback：每次渲染都创建新函数
        const fetchWeather = async () => {
            const response = await fetch(`/api/weather?city=${cityId}`);
            const data = await response.json();
            setWeather(data);
        };

        useEffect(() => {
            const interval = setInterval(fetchWeather, 30000); // 每30秒轮询
            return () => clearInterval(interval);
        }, [fetchWeather]); // fetchWeather 每次渲染都变化，导致 effect 频繁重建

        // ✅ 用 useCallback：只有 cityId 变化时才创建新函数
        const fetchWeather = useCallback(async () => {
            const response = await fetch(`/api/weather?city=${cityId}`);
            const data = await response.json();
            setWeather(data);
        }, [cityId]); // 依赖 cityId

        useEffect(() => {
            fetchWeather(); // 首次获取
            const interval = setInterval(fetchWeather, 30000);
            return () => clearInterval(interval);
        }, [fetchWeather]); // fetchWeather 引用稳定，effect 只在 cityId 变化时重建

        return <div>{weather?.temperature}°C</div>;
    }
    ```

- 场景三：自定义 Hook 中返回函数

    当自定义 Hook 返回函数时，使用 `useCallback` 可以确保函数的引用稳定性

    ```js
    function useClimateControl(initialTemp) {
        const [temperature, setTemperature] = useState(initialTemp);

        const increase = useCallback(() => {
            setTemperature(prev => prev + 1);
        }, []);

        const decrease = useCallback(() => {
            setTemperature(prev => prev - 1);
        }, []);

        const reset = useCallback(() => {
            setTemperature(initialTemp);
        }, [initialTemp]);

        return { temperature, increase, decrease, reset };
    }
    ```

    如果不使用 `useCallback`：当组件调用 `useClimateControl` 时，每次渲染都会创建新的 `increase` 和 `decrease` 函数。这会导致：
    - 接收这些函数的子组件不必要地重新渲染。
    - 依赖这些函数的 useEffect 频繁执行。

### `useMemo` VS `useCallback`

二者就像“双胞胎”。

| 特性 | `useCallback` | `useMemo` |
| :--- | :--- | :--- |
| 缓存对象 | 函数本身 | 函数的返回值 |
| 语法 | `useCallback(fn, deps)` | `useMemo(() => fn(), deps)` |
| 等价关系 | `useCallback(fn, deps)` 等价于 `useMemo(() => fn, deps)` | - |
| 典型场景 | 传递给子组件的回调函数 | 昂贵的计算结果、稳定引用类型 |



## 引用与 DOM 操作类 Hooks

### `useRef`

`useRef` 用于创建可变的引用对象。它在组件的整个生命周期内保持不变，并且不会触发组件重新渲染。

##### 语法说明

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


##### 核心使用场景

- 场景一：引用 DOM 元素

    这是 `useRef` 最常见的用途。类似于 `document.getElementById`。
 
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

    工作原理：
    1. `useRef(null)` 创建了一个 `{ current: null }` 对象。
    2. 当 `<input ref={inputRef} />` 被渲染时，React 会将真实的 DOM 元素赋值给 `inputRef.current`。
    3. 在 `useEffect` 中，`inputRef.current` 已经指向真实的 `<input>` 元素，可以调用 `.focus()` 方法。

- 场景二：在组件渲染间存储可变值，而不触发组件重新渲染。

    ```js
    import { useState, useRef } from 'react';

    function TemperatureMonitor() {
        const [temperature, setTemperature] = useState(26);
        const intervalRef = useRef(null); // 存储定时器 ID

        const startMonitoring = () => {
            if (intervalRef.current !== null) return; // 防止重复启动

            intervalRef.current = setInterval(() => {
            // 模拟温度随机波动
            setTemperature(prev => +(prev + (Math.random() - 0.5) * 2).toFixed(1));
            }, 1000);
        };

        const stopMonitoring = () => {
            if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null; // 重置
            }
        };

        return (
            <div>
            <p>西安立夏实时温度：{temperature}°C</p>
            <button onClick={startMonitoring}>开始监测</button>
            <button onClick={stopMonitoring}>停止监测</button>
            </div>
        );
    }
    ```

    为什么必须用 useRef 存定时器 ID？

    如果用普通变量：

    ```js
    let intervalId = null; // ❌ 每次渲染都会重置为 null
    ```

    如果用 `useState`：

    ```js
    const [intervalId, setIntervalId] = useState(null); // ❌ 每次 setIntervalId 都会触发重新渲染
    ```

    `useRef` 的优势:

    - 定时器 ID 在重新渲染之间保持不变。
    - 修改 `ref.current` 不会触发重新渲染，避免性能浪费。


### `useImperativeHandle`

    用于自定义通过 `ref` 暴露给父组件的实例值或方法。它通常与 `forwardRef` 配合使用。

##### 语法说明

    ```js
    useImperativeHandle(ref, createHandle, dependencies?)
    ```

- 参数：

    - `ref`：从 `forwardRef` 接收的 `ref` 参数，或者从 `props` 中提取的 `ref`。

    - `createHandle`：返回一个对象，这个对象就是父组件通过 `ref.current` 能访问到的内容。

    - `dependencies`（可选）：依赖数组，当依赖变化时重新执行 `createHandle`。

- 返回值： 无返回值

##### 为什么需要 `useImperativeHandle`

在 React 中，数据流默认是单向的：父组件通过 `props` 向子组件传递数据，子组件通过回调函数向父组件通信。但有些场景需要父组件直接调用子组件的方法：

- 聚焦子组件中的输入框
- 清空子组件中的表单
- 打开/关闭子组件中的弹窗
- 控制子组件中的动画

如果不使用 `useImperativeHandle`，父组件通过 `ref` 直接获取到的是子组件的 DOM 节点或组件实例，这破坏了封装性。

##### 核心使用场景

- 场景一：调用子组件方法

    ```js
    import { useRef, forwardRef, useImperativeHandle } from 'react';

    // 子组件：自定义搜索输入框
    const SearchInput = forwardRef(function SearchInput(props, ref) {
        const inputRef = useRef(null);

        // 自定义暴露给父组件的内容
        useImperativeHandle(ref, () => ({
            // 暴露聚焦方法
            focus: () => {
            inputRef.current.focus();
            },
            // 暴露清空方法
            clear: () => {
            inputRef.current.value = '';
            },
            // 暴露获取当前值的方法
            getValue: () => {
            return inputRef.current.value;
            },
        }), []); // 空依赖，方法引用不变

        return (
            <div>
                <input ref={inputRef} placeholder="搜索西安立夏活动..." />
                <span>🔍</span>
            </div>
        );
    });

    // 父组件：搜索面板
    function SearchPanel() {
        const searchRef = useRef(null);

        const handleFocus = () => {
            searchRef.current.focus(); // 调用子组件暴露的 focus 方法
        };

        const handleClear = () => {
            searchRef.current.clear(); // 调用子组件暴露的 clear 方法
        };

        const handleSearch = () => {
            const query = searchRef.current.getValue(); // 调用子组件暴露的 getValue 方法
            console.log('搜索内容：', query);
        };

        return (
            <div>
                <h2>西安立夏活动搜索</h2>
                <SearchInput ref={searchRef} />
                <button onClick={handleFocus}>聚焦搜索框</button>
                <button onClick={handleClear}>清空搜索框</button>
                <button onClick={handleSearch}>搜索</button>
            </div>
        );
    }
    ```

## 上下文与工具类 Hooks


### `useContext`

`useContext` 用于读取和订阅组件中的 `context`。可以把 `useContext` 想象成你小区的公告栏。你（父组件）在公告栏上贴了一张通知（提供数据），所有住户（子组件、孙组件）都可以直接去看，不需要你挨家挨户敲门通知。这就是 Context——跨层级数据共享。

##### 语法说明

```js
const value = useContext(SomeContext)
```

##### `useContext` 的工作流程

1. 创建 `context` 对象。

    最推荐的做法就是把 `context` 放到一个单独的文件导出。
    
    ```js
    // contexts/ThemeContext.js

    // 第一步：创建 Context
    // 参数是默认值，当没有 Provider 时使用
    const ThemeContext = React.createContext('light');
    ```

2. 提供数据。

    ```js
    import { ThemeContext } from './contexts/ThemeContext'; // 导入同一个 Context

    // 父组件：提供 Context 数据
    function App() {
        const [theme, setTheme] = useState('light');

        const toggleTheme = () => {
            setTheme(prev => prev === 'light' ? 'dark' : 'light');
        };

        return (
            // 第二步：使用 Provider 提供数据
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <div style={{
                    background: theme === 'light' ? '#f0f0f0' : '#222',
                    minHeight: '100vh',
                    padding: '20px',
                }}>
                    <h1 style={{ color: theme === 'light' ? '#333' : '#fff' }}>
                        西安立夏主题切换
                    </h1>
                    <ThemeSwitcher />
                    <p style={{ color: theme === 'light' ? '#666' : '#aaa' }}>
                        当前主题：{theme}时间：2026年5月5日 17:56
                    </p>
                </div>
            </ThemeContext.Provider>
        );
    }
    ```


3. 消费数据。

    ```js
    import { ThemeContext } from './contexts/ThemeContext'; // 导入同一个 Context

    // 子组件：消费 Context 数据
    function ThemeSwitcher() {
        const { theme, toggleTheme } = useContext(ThemeContext);

        return (
            <button
                onClick={toggleTheme}
                style={{
                    background: theme === 'light' ? '#fff' : '#333',
                    color: theme === 'light' ? '#333' : '#fff',
                    padding: '10px 20px',
                    border: '1px solid #ccc',
                }}
            >
                当前主题：{theme === 'light' ? '☀️ 白天模式' : '🌙 夜间模式'}
            </button>
        );
    }
    ```

###### 底层原理

1. Context 的数据结构。

    ```js
    // 简化版 Context 对象
    const Context = {
        $$typeof: Symbol.for('react.context'),
        _currentValue: null,    // 当前上下文值
        _currentRenderer: null, // 渲染器引用
        Provider: null,         // Provider 组件
        Consumer: null,         // Consumer 组件（旧 API）
    };    
    ```

2. `useContext` 的执行流程。

    ```js
    // 简化版源码逻辑
    function useContext(Context) {
        // 1. 获取当前 Fiber 节点
        const fiber = currentlyRenderingFiber;
        
        // 2. 从当前 Fiber 节点开始，向上查找最近的 Provider
        let currentFiber = fiber;
        while (currentFiber !== null) {
            const contextProvider = currentFiber.type;
            if (contextProvider === Context.Provider) {
            // 3. 找到 Provider，返回其 value
            return currentFiber.memoizedProps.value;
            }
            currentFiber = currentFiber.return; // 向上遍历父节点
        }
        
        // 4. 没有找到 Provider，返回默认值
        return Context._currentValue;
    }
    ```


    关键点：

    - 动态查找：每次调用 useContext 都会实时查找最近的 Provider，而非静态绑定。
    - Fiber 遍历：通过 Fiber 节点的 return 指针向上遍历组件树。
    - 无订阅机制：useContext 不是发布订阅模式，而是每次渲染时“主动读取”。

3. 重渲染触发机制

    当 `Provider` 的 `value` 发生变化时：
   
    - React 通过 `Object.is` 比较新旧值。
    - 如果不同，React 会标记所有消费该 Context 的组件为“需要更新”。
    - 在下一次渲染时，这些组件的 `useContext` 将返回新值。

### `useId`

`useId` 用于生成唯一且稳定的字符串 ID，主要用于解决无障碍属性（如 aria-describedby、aria-labelledby）和 服务端渲染（SSR） 中 HTML 元素的 
`id` 生成问题。

##### 语法说明

```js
const id = useId();
```

- 参数：无。
- 返回值：一个唯一的字符串 ID，例如 `:r1`: 或 `:r1H2`:。

核心特性： 

- 唯一性：在同一组件树中，每个 `useId` 调用生成的 ID 都是唯一的。
- 稳定性：在组件的生命周期内，ID 保持不变（不会因重新渲染而变化）。
- 跨环境一致性：在服务端渲染（SSR）和客户端渲染（CSR）中，生成的 ID 相同，避免 `hydration` 不匹配。


##### 为什么需要 `useId` ？

- 问题一： 硬编码 ID 导致冲突。

    同一个组件被多次渲染时，如果使用硬编码的 ID，会导致冲突。

- 问题二： 随机 ID 导致 SSR 不匹配。

    在服务端渲染（SSR）中，服务端生成 HTML 时创建了 ID "0.abc123"，但客户端 hydration 时重新生成了 "0.xyz789"，导致 hydration 不匹配。

##### 底层原理

`useId` 生成的 ID 格式为 `:r1:` 或 `:r1H2:`，其中：

- 冒号：作为分隔符，避免与 CSS 选择器冲突。
- r 或 R：标识渲染环境。
    - r（小写）：客户端渲染。
    - R（大写）：服务端渲染。
- 数字：唯一标识符，基于组件在树中的位置生成。

生成逻辑：

```js
// 简化版源码逻辑
function mountId() {
  const root = getWorkInProgressRoot();
  const identifierPrefix = root.identifierPrefix;

  if (getIsHydrating()) {
    // 服务端渲染：基于组件树位置生成
    const treeId = getTreeId();
    id = ':' + identifierPrefix + 'R' + treeId;
    const localId = localIdCounter++;
    if (localId > 0) {
      id += 'H' + localId.toString(32);
    }
    id += ':';
  } else {
    // 客户端渲染：基于全局计数器生成
    const globalClientId = globalClientIdCounter++;
    id = ':' + identifierPrefix + 'r' + globalClientId.toString(32) + ':';
  }

  return id;
}
```

关键点：
- 服务端渲染：ID 基于组件在树中的路径生成，确保相同组件树生成相同 ID。
- 客户端渲染：ID 基于全局计数器生成，确保唯一性。
- `hydration` 一致性：服务端和客户端使用相同的组件树，生成的 ID 相同。

### `useTransition`

`useTransition` 用于将状态更新标记为“过渡更新”（低优先级），从而让高优先级的更新（如用户输入、点击）能够打断低优先级的渲染任务。

##### 语法说明

```js
const [isPending, startTransition] = useTransition()
```
- 参数： 无
- 返回值：
    - `isPending`：布尔值，表示是否有待处理的过渡更新。当 true 时，可以显示加载状态。
    - `startTransition`：函数，用于将回调中的状态更新标记为过渡更新。


核心特性：
- 非阻塞：过渡更新不会阻塞用户交互。
- 可中断：高优先级更新可以打断正在进行的过渡更新。
- 优先级调度：React 会根据优先级调度渲染任务。

##### 为什么需要 `useTransition`？

假设你有一个搜索功能，用户输入关键词后，需要过滤一个包含 5000 条数据的列表。

```js
// ❌ 问题代码：所有更新都是同优先级
function SearchPage({ allItems }) {
    const [query, setQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState(allItems);

    function handleInput(e) {
        const value = e.target.value;
        setQuery(value); // 更新输入框内容

        // 耗时操作：过滤 5000 条数据
        const filtered = allItems.filter(item =>
        item.name.includes(value)
        );
        setFilteredItems(filtered); // 更新列表
    }

    return (
        <div>
            <input value={query} onChange={handleInput} placeholder="搜索..." />
            <ul>
                {filteredItems.map(item => (
                <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
}
```

**问题**： 每次输入，`setQuery` 和 `setFilteredItems` 都在同一个渲染批次中执行。过滤 5000 条数据的计算会阻塞主线程，导致输入框卡顿——用户敲了键盘，但光标不动，字符不显示。

**解决方案**： 使用 `useTransition` 将过滤操作标记为过渡更新，让高优先级更新（如用户输入）打断低优先级更新（过滤）。

```js
// ✅ 优化代码：区分优先级
function SearchPage({ allItems }) {
    const [query, setQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState(allItems);
    const [isPending, startTransition] = useTransition();

    function handleInput(e) {
        const value = e.target.value;

        // 紧急更新：立即更新输入框
        setQuery(value);

        // 非紧急更新：标记为过渡，可被中断
        startTransition(() => {
            const filtered = allItems.filter(item =>
                item.name.includes(value)
            );
            setFilteredItems(filtered);
        });
    }

    return (
        <div>
        <input value={query} onChange={handleInput} placeholder="搜索..." />
        {isPending && <p>⏳ 正在过滤结果...</p>}
        <ul style={{ opacity: isPending ? 0.5 : 1 }}>
            {filteredItems.map(item => (
            <li key={item.id}>{item.name}</li>
            ))}
        </ul>
        </div>
    );
}
```

**效果**：
- 用户输入时，输入框立即响应，字符即时显示。
- 列表过滤在后台进行，如果用户继续输入，上一次的过滤任务会被中断，重新基于最新输入值开始。
- `isPending` 为 `true` 时，可以显示加载提示或降低列表透明度。

### `useDeferredValue`

`useDeferredValue` 用于获取一个值的延迟版本，让 React 可以在后台以低优先级处理该值的更新。

可以把 `useDeferredValue` 想象成西安回民街烤肉店的排队系统。你（用户）在窗口点单（输入），收银员（React）立即记录你的订单（紧急更新），但烤肉需要时间准备（非紧急更新）。收银员不会让你在窗口干等，而是给你一个号牌，让你先去坐着，等肉烤好了再叫你。`useDeferredValue` 就是那个“号牌”——它代表一个延迟版本的值，让 React 可以先处理紧急更新，再处理非紧急更新。


##### 语法说明

```js
const deferredValue = useDeferredValue(value, initialValue?)
```

- 参数：
    - `value`：你想延迟的值，可以是任何类型（字符串、数字、对象、数组等）。
    - `value`: initialValue（可选）：组件初始渲染时使用的值。如果省略，初始渲染时 `deferredValue` 等于 `value`.

- 返回值：

    - `deferredValue`：一个“滞后于” `value` 的值。

##### 底层原理

```text
时间轴 →
┌─────────────────────────────────────────────────────────┐
│  用户输入 "西" → value = "西"                            │
│  ┌─ 紧急渲染 ──────────────────────────────────────────┐ │
│  │  输入框显示 "西"（使用 value）                        │ │
│  │  列表显示旧结果（使用 deferredValue = ""）            │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  用户输入 "西安" → value = "西安"                         │
│  ┌─ 紧急渲染 ──────────────────────────────────────────┐ │
│  │  输入框显示 "西安"（使用 value）                       │ │
│  │  列表显示旧结果（使用 deferredValue = "西"）           │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  用户停止输入 → React 开始后台渲染                        │
│  ┌─ 后台渲染 ──────────────────────────────────────────┐ │
│  │  列表显示新结果（使用 deferredValue = "西安"）         │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

关键点：
- 第一次渲染：`deferredValue` 等于 value。
- 后续更新：React 先用旧值渲染（紧急），然后在后台用新值重新渲染（非紧急）。
- 中断机制：如果后台渲染期间 `value` 再次变化，后台渲染被中断，重新开始。

##### 核心使用场景

- 场景一：搜索框实时过滤（最经典）

    西安立夏的景点搜索示例：

    ```js
    import { useState, useDeferredValue, useMemo } from 'react';

    const allAttractions = [
    '大唐芙蓉园', '西安城墙', '回民街', '大雁塔', '小雁塔',
    '兵马俑', '华清宫', '钟楼', '鼓楼', '陕西历史博物馆',
    '大明宫国家遗址公园', '曲江池遗址公园', '西安碑林博物馆',
    '西安博物院', '西安世博园', '西安植物园', '西安动物园',
    // ... 更多景点
    ];

    function AttractionSearch() {
        const [query, setQuery] = useState('');
        const deferredQuery = useDeferredValue(query);

        // 使用 deferredQuery 进行过滤，而不是 query
        const filteredAttractions = useMemo(() => {
            console.log('过滤计算执行了');
            return allAttractions.filter(attraction =>
            attraction.includes(deferredQuery)
            );
        }, [deferredQuery]);

        // 检查是否处于延迟状态
        const isStale = deferredQuery !== query;

        return (
            <div>
                {/* 输入框使用实时值 */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="搜索景点..."
                    style={{ padding: '8px', width: '300px' }}
                />

                {/* 列表使用延迟值 */}
                <div style={{ opacity: isStale ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                    {isStale && <p>⏳ 正在过滤...</p>}
                    <ul>
                    {filteredAttractions.map((attraction, index) => (
                        <li key={index}>{attraction}</li>
                    ))}
                    </ul>
                </div>
            </div>
        );
    }
    ```

    效果：
    - 用户快速输入时，输入框即时响应，没有卡顿。
    - 列表过滤在后台进行，如果用户继续输入，上一次的过滤任务被中断。
    - 通过 isStale 可以显示加载状态或降低列表透明度。

- 场景二：大数据列表渲染

    ```js
    import { useState, useDeferredValue, useMemo } from 'react';

    function LargeDataList() {
        const [filter, setFilter] = useState('');
        const deferredFilter = useDeferredValue(filter);

        // 模拟 10000 条数据
        const allData = useMemo(() => {
            return Array.from({ length: 10000 }, (_, i) => ({
                id: i,
                name: `西安立夏活动 ${i + 1}`,
                category: i % 3 === 0 ? '文化' : i % 3 === 1 ? '美食' : '户外',
                }));
        }, []);

        const filteredData = useMemo(() => {
            console.log('过滤 10000 条数据...');
            return allData.filter(item =>
                item.name.includes(deferredFilter) ||
                item.category.includes(deferredFilter)
            );
        }, [deferredFilter, allData]);

        return (
            <div>
                <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="过滤活动..."
                />
                <div style={{ height: '400px', overflow: 'auto' }}>
                    {filteredData.map(item => (
                    <div key={item.id}>
                        {item.name} - {item.category}
                    </div>
                    ))}
                </div>
            </div>
        );
    }
    ```

## 自定义 Hook

自定义 Hook 是一个以 `use` 开头的  函数JS，它内部可以调用其他 Hook（如 `useState`、`useEffect`、`useContext` 等），用于封装可复用的状态逻辑。

示例：

```js
function useCustomHook(param1, param2) {
    // 内部可以调用其他 Hook
    const [state, setState] = useState(initialValue);

    useEffect(() => {
        // 副作用逻辑
    }, [dependencies]);

    // 返回需要暴露的数据和方法
    return { state, setState, otherValue };
}
```
核心特征：
- 以 `use` 开头：这是 React 识别自定义 Hook 的约定，也是 ESLint 插件检查 Hook 规则的依据。
- 内部调用其他 Hook：自定义 Hook 的本质是“Hook 的组合器”。
- 返回任意值：可以返回数组、对象、函数、原始类型等。
- 状态隔离：每个组件调用同一自定义 Hook 时，都会获得独立的状态副本。

##### 自定义 Hook 的设计原则

- 原则一：单一职责

    每个自定义 Hook 只负责一个特定的功能。

- 原则二：命名语义化

- 原则三：状态最小化

    尽量减少自定义 Hook 内部的状态，将状态管理的职责交给调用者。

- 原则四：参数化配置

    支持通过参数配置行为，提高灵活性。



