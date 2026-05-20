# Fiber 架构

在 React 16 版本， 官方对底层进行了一次“推倒重来”式的重构。

- 在 React 15 时代，架构被称为 Stack Reconciler（栈协调器）或 栈架构，它是同步堆栈渲染架构
- 在 React 16 时代，架构被称为 Fiber 架构，它是一个异步并发架构。

本次重构的核心核心目的是解决下面几个问题：
 


## 架构的三大核心模块

为了实现高效、可中断的渲染，Fiber 架构将工作流程拆分成了三个独立的部分：

- Scheduler（调度器）
   
   - 职责：决定什么时候干活。它会监控浏览器的空闲时间，并在有高优先级任务（如用户输入）时，中断当前的渲染工作。

   - 核心机制：使用了类似 requestIdleCallback 的机制，但在兼容性和触发频率上做了大量优化，目前使用的是 **Lane 模型** 来区分任务优先级。

- Reconciler(协调器)

    - 职责：它负责找出 UI 哪些部分需要改变。对比新旧虚拟 DOM（即我们聊到的 Fiber 树），并给有变化的 Fiber 节点打上标记（如 Placement、Update、Deletion）。
    - 核心机制：在内存中构建 workInProgress 树（双缓存 Fiber 树）。由于这个过程是在内存中进行的，且是基于 Fiber 链表结构，所以它是可以随时被中断的。

- Renderer（渲染器）

    - 职责：负责把协调器的计算结果真正画到屏幕上。根据 Reconciler 打的标记，执行具体的宿主操作。
    - 多样性：不同的平台有不同的渲染器。
        - react-dom：负责浏览器 DOM。
        - react-native：负责手机原生 UI。
        - react-art：负责 Canvas/SVG。



## Fiber 节点

你可以在这里看到 [Fiber 的数据结构](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiber.new.js#L117)。Fiber 的三重身份:

1. 作为数据结构

    每一个 Fiber 节点都对应一个组件或 DOM 元素。它本质上是一个普通的 JS 对象，存储:
    
    - 组件信息：类型（type）、属性（pendingProps）。
    - 状态信息：存储组件状态，指向的是 Hooks 链表。
    - 副作用信息：记录该节点是否需要插入、更新或删除（flags）。


2. 作为指针链表

    传统的树结构通常用 children 存储子节点，但 Fiber 为了方便中断和恢复，使用了三指针链表记录树节点关系，并基于此遍历和更新组件树。分别是:

    - child：指向子节点。

    - sibling：指向兄弟节点。

    - return：指向父节点。

    这种结构允许 React 在处理完一个节点后，通过指针快速找到下一个任务，或者在中断后重新找回位置。 
    
3. 作为工作单元（调度核心）

    每个 Fiber 节点都是一个待处理的任务。React 的 Scheduler（调度器） 会根据优先级来决定先处理哪个 Fiber。

    - 它会利用浏览器的空闲时间（类似于 requestIdleCallback 的机制）来遍历 Fiber 树。

    - 如果这时有更高优先级的任务（如用户输入），React 会暂停当前的 Fiber 构建，先去处理交互。