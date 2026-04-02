# sourcemap

无论是打包工具，还是源码调试，我们都能看到sourcemap的身影，那么到底什么是sourcemap?

其实sourcemap是**浏览器**支持的一种源码映射方式。一般来讲我们在浏览器中运行的js代码是经过编译的，我们很难读懂，因此给我们的开发调试带来了很大的困难，所以我们需要一种将“运行的代码”与“开发的代码”相关联的一种机制，所以sourcemap诞生了。通常，我们出于以下目的对我们的源码进行编译：

- 代码压缩。体积太大的js、html、css等文件会大大增加浏览器文件加载的时间，从而对用户体验造成障碍，所以我们会对代码进行编译，去掉无用的代码、空格、换行等无用字符。
- 文件合并。网络资源是宝贵的，减少文件的数量能够减少请求的次数。
- 盛行的typescript、flow.js等强类型语言最终都需要编译成js代码。

当我们开启sourcemap的时候，通常编译后会至少包含两个文件：源文件和映射文件，在源文件的最后一行，会有下面格式的注释，来指明映射文件的路径。

```javascript
//# sourceMappingURL=vue.js.map
```

映射文件通常以“.map”作后缀。如Vue源码。

![sourcemap](./images/sourcemap.png)

创建源代码映射的第一版是供[Closure Inspector](https://code.google.com/archive/p/closure-inspector/) 使用的 。现行的sourcemap是[第三版](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit)，由Google和Mozilla的代表共同编写。但是通常我们是不需要知道.map文件中包含的到底是什么，如果有需要，可以查看其版本规范。



