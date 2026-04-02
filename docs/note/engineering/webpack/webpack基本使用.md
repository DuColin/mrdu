# webpack基本使用

webpack是用于JavaScript应用程序的静态模块打包工具。

打包工具应该具有哪些功能？

- 死代码的去除。

在程序开发中，很多开发工具都被设计为opinionated(固执己见的)，即将很多配置被设置为默认的，不提供API允许开发者进行个性化设置。

学习webpack最好的途径就是[官网](https://webpack.js.org/)。但是在阅读官网有几点需要注意。

- 模块（moudle）
- 编译器（compiler）

## 基本使用

## 配置选项 

### 模式（mode）

mode字段告知webpack使用何种模式，进行相应的内置优化。它有两种配置方式：

- 配置对象中提供mode选项。

  ```javascript
  const webpackConfig = {
      mode: 'development'
  };
  ```

- 通过CLI参数传递。

  ```shell
  webpack --mode = development
  ```

mode可以被设置可选三个值：development、production和none，当值被设置为none时，表示不使用任何优化项。并且如果没有通过配置文件或者CLI设置mode时，CLI将有可能使用有效的NODE_ENV的值作为mode。

把mode的值设置为development或production时，实际上是将DefinePlugin中process.env.NODE_ENV设置为相应的值。但是需要注意的是这并不是在node上添加了环境变量，具体内容查看DefinePlugin。

```javascript
const webpackConfig = {
    mode: "development",
};
// 等同于
const webpackConfig = {
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": "development",
        }),
    ],
};
```

### devtool

devtool用来控制是否生成，以及如何生成source-map。在source-map那一章节我们可以了解到什么是source-map。

配置devtool很简单，但是其[可配置的值](https://webpack.docschina.org/configuration/devtool/#devtool)有二十 多项。并且官网中对于配置值的解释却令人迷惑，下面主要是对官网中的内容解释。

devtool虽然有二十多个可配置的值，但是它们的值主要由下面几个词进行组合。

- eval。使用eval执行每个模块。这样做的好处是rebuild时会非常快。
- cheap。生成的source map中只有行信息，而没有列信息，编译计算量少，
- inline。不生成单独的source map文件，而是把source-map转换为DataUrl后添加到bundle中。
- module。使用loader输出的source map信息。
- hidden。bundle中不包含source map的信息。

官网中对devtool的可选值列了一个表格。其中每行列的含义如下。

- performance。这个使用不同source map后打包速度的描述。build表示初次打包的性能，rebuild表示的是修改代码保存后再次打包的性能。该性能被分为slowest、slow、ok、fast、fastest五个档。
- production。表示能够用于生产环境。

当然官网中也对于不同场景使用哪些值做了比较。在开发环境我们通常使用`eval-cheap-module-source-map`，在生产环境则不生成source-map。

## loader

loader被翻译为“加载器”或者“预处理器”。 webpack只能处理JavaScript和JSON文件，这是它自带的能力，但是在开发中我们肯定不仅限于使用JavaScript和JSON，例如css样式的样式扩展Less、Scss，JavaScript的扩展TypeScript等。loader让webpack有能力处理其他类型的文件，并将其转化为webpack能够识别的chunk，以方便并将其添加到依赖树中。

### 使用

loader有两种[使用](https://webpack.docschina.org/concepts/loaders/#using-loaders)方式：

- 配置方式：在wbpack.config.js文件中指定loader。
- 内联方式：在`import`语句中显示指定loader。

#### 配置方式

loader是被配置在`module.rules`数组中的，这意味可以配置多个加载器。一个常见的配置方式如下：

```javascript
const webpackConfig = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                include: process.cwd(),
                exclude: config.jsexclude,
                loader: "vue-loader",
                options: {
                    compilerOptions: {
                        preserveWhitespace: false,
                    },
                },
            },
            {
                test: /\.(scss|css)$/,
                use: [isProd ? MiniCssExtractPlugin.loader : "style-loader", "css-loader", "sass-loader"],
            },
        ],
    },
};
```

在上面的示例中，使用loader把`vue`和`scss、css`文件转换为webpack可以处理的模块。配置项含义如下：

- rule.test。通常使用正则表达式匹配loader需要处理的文件。
- rule.include。指向需要处理的文件，可以文件或者文件夹。通常被配置为文件夹，`rule.test`在`rule.include`配置的文件下匹配。
- rule.exclude。用于排除`rule.inclue`配置中不需要被打包的文件，也就是说`rule.exclude`是`rule.include`配置的子集。
- rule-loader。`rule.loader`是`rule.use: [{loader}]`的简写。
- rule-use。它的值可以是字符串（如：`use: {'style-loader'}`），也可以是`useEntries`数组。
- rule-options。它用来个loader传递参数，`rule.options`是`rule.use: [{options}]`的简写。

详细的配置方式参考[官网](https://webpack.docschina.org/configuration/module/#modulerules)

#### 内联方式

在import语句（或任何[与“import”方法同等的引入方式](https://webpack.docschina.org/api/module-methods)）中显示指定loader。使用`!`把资源中的loader分开。每个部分都相对于当前目录解析。

```javascript
import Styles from 'style-loader!css-loader?modules!./styles.css';
```

通过import添加前缀，可以覆盖配置中的loader，preLoader和`postloader`。

- 使用 `!` 前缀，将禁用所有已配置的 normal loader(普通 loader)。

  ```javascript
  import Styles from '!style-loader!css-loader?modules!./styles.css';
  ```

- 使用 `!!` 前缀，将禁用所有已配置的 loader（preLoader, loader, postLoader）。

  ```javascript
  import Styles from '!!style-loader!css-loader?modules!./styles.css';
  ```

- 使用 `-!` 前缀，将禁用所有已配置的 preLoader 和 loader，但是不禁用 postLoaders。

  ```javascript
  import Styles from '-!style-loader!css-loader?modules!./styles.css';
  ```

### 执行顺序

### 常用的loader

在webpack官网可以看到[常用的loader](https://webpack.docschina.org/loaders/)，更多的loader查看[awesome webpack](https://webpack.docschina.org/awesome-webpack/#loaders)。

## 插件（plugin）

插件用于增强webpack的能力，例如：打包优化、资源管理、注入环境变量等。它是一个具有apply方法的JavaScript对象，apply方法可以被webpack compiler调用，并且在整个编译声明周期都可以访问compiler对象。 

### 基本使用

插件的使用很简单，有两种使用方式：配置方式和node API。

- 配置方式。在配置对象的plugins数组中，传入一个 plugin的new实例，并在创建实例时传入参数。

  ```javascript
  const webpackConfig = {
      plugins: [
          // 添加了一个模块热更新插件
          new webpack.HotModuleReplacementPlugin(),
          // 添加了html模板插件
          new HtmlWebpackPlugin({
              template: "./examples/index.tpl",
              filename: "./index.html",
              favicon: "./examples/favicon.ico",
          }),
      ],
  };
  ```

  

- node API方式调用。在创建插件示例时，并通过apply调用实例时传入compiler对象。

  ```javascript
  const webpack = require('webpack'); // 访问 webpack 运行时(runtime)
  const configuration = require('./webpack.config.js');
  
  let compiler = webpack(configuration);
  
  new webpack.ProgressPlugin().apply(compiler);
  
  compiler.run(function (err, stats) {
    // ...
  });
  ```

插件的执行顺序也很重要，但是和loader执行顺序不同的是：插件是绑定到webpack编译器的事件上的，在编译器触发某个事件时，相关插件就会被执行。

### 常用的Plugin

在webpack官网中列出了[常用的插件](https://webpack.docschina.org/plugins/)，更多的插件查看 [awesome webpack](https://webpack.docschina.org/awesome-webpack/#webpack-plugins)。

#### DefinePlugin

DefinePlugin用于在**编译时**将代码中的变量替换为其他值或者表达式，它常常用来定义变量来区分花环境。例如：

```javascript
const webpackConfig = {
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": "development",
            VERSION: JSON.stringify("5fa3b9"),
        }),
    ],
};
```

然后再代码中这样使用它。

```javascript
if (process.env.NODE_ENV === "development") {
    console.log("Do Something");
} else {
    console.log("Do Other Something");
}
```

DefinePlugin并不是简单的在全局变量下定义了这些变量，然后在代码中直接使用这些变量。它只是编译期的变量替换工据，这意味着它在webpack的编译阶段就已经完成了变量的替换工作，而不会影响到全局变量。例如：

上面根据上面的配置，代码会被编译为：

```javascript
 console.log("Do Something");
```

## 打包原理

webpack打包是一个串行的过程，从启动到结束经历下面几个阶段。

1. 初始化参数。将配置文件中的参数、命令行传入参数、默认参数合并，生成编译器参数。
2. 开始编译。根据上面得到的参数初始化compiler对象，加载所有插件，执行`run()`方法。
3. 确定入口。根据配置找出所有编译入口。
4. 编译模块。从入口触发，调用已加载的loader对模块进行编译。找出该模块的依赖模块，然后在使用loader处理。递归执行本步骤。
5. 完成模块编译。此时一句得到了一个模块的依赖树。
6. 输出资源。根据入口和模块之间的依赖关系，组成成一个个包含多个模块的chunk。
7. 输出完成。确定编译输出的路径和文件名，将文件内容输出到配置的路径和文件名。

## 使用问题



## 参考文档

[1]: https://indepth.dev/posts/1482/an-in-depth-perspective-on-webpacks-bundling-process	"深入了解webpack的打包过程"
[2]: https://segmentfault.com/a/1190000021494964	"webpack打包原理？这篇看完你就懂了"

