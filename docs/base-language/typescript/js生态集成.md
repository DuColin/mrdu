# js生态集成

TypeScript设计之初就考虑了与现有JavaScript生态的无缝集成，这使得引入TypeScript的成本大大降低。

## 第三方模块的类型支持

根据对ts支持的深度来划分，有四种类型的包：
- 原生 ts 包。
- 自带类型的 js 包
- 拥有外部声明（@types）的包
- 没有任何类型声明的包

##### ts 是如何找到这些类型的？


### 自带类型定义的模块

现代JavaScript库越来越多地自带TypeScript类型定义：

```typescript
// 直接安装使用，无需额外配置
import { useState } from 'react'
import { createRouter } from 'vue-router'
```

这些库在package.json中包含types或typings字段，TypeScript会自动识别。

### @types类型声明包

对于不自带类型定义的库，DefinitelyTyped项目提供了社区维护的类型定义：

```bash
# 安装类型定义包
npm install --save-dev @types/lodash
npm install --save-dev @types/node
npm install --save-dev @types/jest
```

类型定义包的命名规则是`@types/包名`，安装后TypeScript会自动识别。

##### 查找类型声明的方式

1. **官方文档**：查看库的文档是否说明TypeScript支持
2. **TypeSearch**：访问 https://www.typescriptlang.org/dt/search 搜索
3. **npm搜索**：搜索`@types/包名`
4. **IDE提示**：VSCode会提示安装可用的类型包

## 处理非JavaScript资源

在实际开发中，我们通常会使用到 css、less、scss、png、jpg、jpeg、svg 等非JavaScript 资源。这些资源可能会被类似下面的方式引入，我们需要处理这些引入的资源。

在 ts 工程中，每一个文件都会被当成一个模块，所以我们需要为这些资源模块提供**模块声明**。

```ts
import styles from "./index.module.css"
```

##### 为什么要为这些资源模块提供模块声明？

typescript 编译过程中的类型检查阶段，会逐个检查引入的模块，它要搞清楚这是不是一个模块？这个模块导出了什么？类型是什么？

然而 typescript 自身的模块系统只能认识 `.ts、tsx、.d.ts、.js、.jsx` 模块，它不知道 `.css、.less、.scss` 等模块是什么。

因此我们需要为这些模块提供声明，这么做不是为了让 ts “编译它们”，而是为了让 ts “理解它们”。真正处理这些资源的是构建工具，比如 webpack、vite 等。

下面我们看如何为这些模块提供声明。


### 使用.d.ts声明文件

在旧的项目里，我们通常需要自己为这些资源编写类型声明，下面是一个示例。

```typescript
// src/types/assets.d.ts
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.less' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.html' {
  const content: string
  export default content
}
```

### 使用公共工具声明

对于大多数项目来讲，这些非 javascript 资源是必不可少的。在每个项目，或者说每个人创建项目的时候，都自己手动编写这些资源模块的声明文件，显然不够聪明的做法。

所以在一些工具或者项目模板里，就内置了这些资源的模块声明文件，我们只需要引入就行了。下面是几种创建项目的方式。

#### 使用 vite 创建项目

在使用 vite 创建的 typescript 项目中，我们在 `tsconfig.app.json` 会发现下面的配置。
```json 
/// tsconfig.app.json
{
    "compilerOptions": {
        "types": [
          "vite/client",
        ],
    },
}
``` 
找到 `/node_modules/vite/client.d.ts` 文件，它就是 vite 提供的声明文件。你会发现，这里几乎声明了所有我们可能用到的外部资源模块。

## DOM类型支持