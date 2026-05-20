# JSX

react和vue一样，但是react没有人为的将构建ui的html标签和用于逻辑处理的js相分离，而是将逻辑和标签放在一个称为“组件”的松耦合的单元中，以期能够实现组件复用、将整个项目模块化。为了达到这个目的，React添加了一种JSX的语法，但是JSX不是一种新语言，而是一种在JavaScript代码中直接书写html标签的语法糖。

react采用JSX来创建项目的最小单位：元素，组件是由元素构成的。但React不强制使用JSX。有关JSX的更多信息参考[官网](https://zh-hans.reactjs.org/docs/jsx-in-depth.html#gatsby-focus-wrapper)

## 本质

babel会把JSX转化为一个React.createElement()函数调用。该函数的参数组成的对象称为“元素”，对象详细内容后面在说。

```javascript
const element = <h1 tabIndex="0">hello</h1> 

// 转化为 
const element = React.createElement( 'h1', {tabIndex: 0}, 'hello' );
```

## 语法

### 元素

1. 自定义元素必须以大写字母开头。

   ```jsx
   // 组件名称必须以大写字母开头!
   function Hello() {
       return <div>hello world!</div>;
   }
   
   // 即使定义了小写字母开头的组件，在JSX使用它之前也必须把它赋值给一个大写字母开头的变量
   function hello() {
       return <div>hello world!</div>;
   }
   ```

2. 使用点语法引用组件。
   ```jsx
   const components = {
       Video(props) {
           return <video src={props.src} type="video/mp4" />;
       },
       Image(props) {
           return <img alt="无图片" src={props.src} />;
       },
   };
   
   function showVideo(props) {
       return <components.Video src={props.src} />;
   }
   ```

3. 动态引用组件。

   ```jsx
   const components = {
       Video(props) {
           return <video src={props.src} type="video/mp4" />;
       },
       Image(props) {
           return <img alt="无图片" src={props.src} />;
       },
   };
   
   function ShowMedia(props) {
       const Media = components[props.type];
       return <Media src={props.src}></Media>;
   }
   ```

### 属性

1. 将表达式或者变量作为Props。
2. 将字符串字面量作为Props。
3. 将数字字面量作为Props。
4. 将函数作为Props。
5. 无默认值的属性名，默认值为true。
6. 属性展开。
7. 样式

### 子元素

1. 字符串字面量作为子元素。

2. Boolean、Null、Undefined子元素会被忽略。

3. 表达式作为子元素。

   ```jsx
   const name = "张三"; 
   const element = <hl>你好， {name}</h1>
   ```

4. 函数作为子元素。

5. 元素作为子元素。

### 条件渲染

### 列表渲染

