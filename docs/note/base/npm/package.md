#  package.json详解 

package.json是包的必须配置的一个文件，其包含了描述包的元数据。package.json文件存在的意义就是为了方便他人安装和管理包，所以详细了解package.josn是必须的。在[npm官网](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)详细描述了这个文件。

在这里，我们把package.json中可配置的字段进行分类介绍。

## 字段解析

### 基本信息

#### name

包的名称。在npm网站通过包名搜索、通过npm cli安装包、在代码中引入包等场景中，使用的都是`name`字段配置的包名。

对于一个可以被发布的包来讲，`name`和`version`字段是必须的，因为`name`和`version`能够构成一个唯一的标识符（范围包也是如此）。并且包名会有下面的限制。

- `name`必须少于或等于214个字符，这包括范围包中的scope。
- 范围包的名称可以以点或下划线开头，没有范围则是不允许的。
- 包的名称中不得包含大写字母。
- 因为包名最终会成为官网URL、命令行参数个文件夹名称的一部分，因此，包名不能包含任何非URL安全字符。

#### version

包的版本号。在每次修改并发布包的时候应该同步修改版本号。就像上面所说，`name`和`version`共同构成了包的唯一标识，因此对于被发布的包来讲，这个字段的配置是必须的。

#### description

描述信息。在npm网站搜索一个 的时候会同时展示这个描述信息，这帮助包的使用者快速了解你的包是否是它需要的。

<!-- ![image-20220912101018884](/assets/npm/description.png) -->

#### keywords

包的关键字，这是一个字符串数组。同样的，关键字信息也是为了让开发者能够根据需要找到你所发布的包。

```json
{
    "keywords": ["node.js", "javascript"]
}
```

#### homepage

包的主页。通常主页是包的使用教程。

```json
{
    "homepage": "https://github.com/owner/project#readme"
}
```

#### bugs

这个字段的值可以是对象或者字符串，可以配置项目问题跟踪的URL或用来报告问题的email地址。如果你执行提供一个url地址，则可以把`bugs`的值指定为字符串。并且提供的url会被`npm bugs`命令使用。

```json
{
    "bugs": {
        "url": "https://github.com/owner/project/issues",
        "email": "project@hostname.com"
    }
}
// 或
{
    "bugs": "https://github.com/owner/project/issues",
}
```

#### repository

这个字段指定包存储库的位置。它的值可以是一个对象，也可以是字符串。

当它的值是对象的时候，该对象可以有下面几个字段：

- type：版本控制系统（VCS，Version Control System，例如git和svn）的类型。
- url：它是一个可以直接传递给VCS的url，可以只有代码的获取权限。
- directory：如果当前package.json不再当前项目的根目录中（例如monorepo的一部分），可以指定它所在的目录。

并且如果当前代码是存储在GitHub上的git存储库，可以通过`npm docs`命令打开它。示例如下：

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/facebook/react.git",
    "directory": "packages/react-dom"
  }
}
```

它的值可以是单个字符串，对于 GitHub、GitHub gist、Bitbucket 或 GitLab 存储库，你可以使用`npm install`直接安装它，实例如下。

```javascript
{
  "repository": "npm/npm",

  "repository": "github:user/repo",

  "repository": "gist:11081aaa281",

  "repository": "bitbucket:user/repo",

  "repository": "gitlab:user/repo"
}
```



#### license

包的使用许可。对于一个开源包来讲，使用许可是比较重要的，它告诉开发者该如何使用它，以避免可能出现的法律风险。

包经常使用的是`BSD-2-Clause`或者`MIT`通用许可。你可以查看[SPDX 许可证 ID 的完整列表](https://spdx.org/licenses/)，或者更好的是选择一个[OSI](https://opensource.org/licenses/alphabetical)批准的许可。

如果你不希望根据任何许可授予它是使用私有或者未发布的包的权利，可以将其配置为：

```json
{
    "license": "UNLICENSED"
}
```

#### people字段：author, contributors

“person”是一个包含“name”的字段和可选的“url”和“email”字段的对象。“author”字段是一个person对象，“contributors”是一个person数组。

```json
{
    "author": {
        "name": "DuCongcong",
        "email": "ducongcong1996@outlook.com",
        "url": "https://mrducongcong.com"
    }
}
```

你也可以把它简写为一个字符串：

```json
{
    "author": "DuCongcong<ducongcong1996@outlook.com>(https://mrducongcong.com)"
}
```

#### funding

项目的资助方。也许我们的项目会被白嫖，但是资助方也算是参与的项目的贡献者。可以通过下面的格式把展示资助方。

```json
{
  "funding": {
    "type" : "individual", // 个人
    "url" : "http://example.com/donate"
  },
  "funding": {
    "type" : "patreon",  // 组织
    "url" : "https://www.patreon.com/my-account"
  },
  "funding": "http://example.com/donate",
  "funding": [
    {
      "type" : "individual",
      "url" : "http://example.com/donate"
    },
    "http://example.com/donateAlso",
    {
      "type" : "patreon",
      "url" : "https://www.patreon.com/my-account"
    }
  ]
}
```

### 功能字段

####   files

可选的`files`字段文件模式（file pattern）的数组，描述了当你的包作为依赖项被安装时应该包含的文件或者文件夹。

有时候我们并不需要把工程目录下的所有文件或者文件夹发布到npm仓库上（比如测试代码、示例代码），换一种说法就是我们可能仅仅把某些必要的文件或者文件夹上发布到npm仓库。这两种不同的说法体现了两种不同的思想：黑名单和白名单。

这里的files字段的功能实际上就是一个白名单。并且在npm中还存在一个`.npmignore`的配置文件，该配置文件中配置的文件项在发布时将会被忽略，这意味着`.npmigonre`文件是一个黑名单。但是在使用上需要注意的是：配置在根目录下的`.npmignore`文件不能够覆盖“files”字段的配置，但是配置在子目录下的可以。

根据经验，对于我自己的项目：当我的项目中有很多不需要包含在发布包中的配置文件（构建脚本、配置文件）时，使用`files`字段配置；当只有几个这样的辅助文件时，使用`.npmignore`配置。

但是，无论`files`字段如何设置，下面这些文件将始终会被包含：

- `package.json`
- `README`
- `LICENSE/LICENCE`
- “main”字段配置的文件。

相反，下面的这些文件总是会被忽略，还有一些其他文件也会被忽略，可以参考[官网](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files)，这里只列举了一些常见的文件。

- `.git`
- `.svn`
- `.*.swp`
- `.npmrc`
- `node_modules`
- `.package-lock.json`
- `npm-deug.log`

#### main

main字段配置的是一个脚本文件，该文件作为包的主入口。假如我们有一个被命名为“foo”的包，并且用户通过`require('foo')`导入了这个包，那么这个语句返回的就是主入口文件（主模块）所导出的对象。

对于大多数模块来讲，设置一个主脚本是有意义的。但是如果main字段没有被设置，默认为包根文件下的index.js文件。

#### browser

这个字段`main`字段一样都是为了指定一个模块的入口。不同的是，如果你的模块打算在浏览器客户端使用，则应该使用这个字段。在下面的“main、browser、module字段的区别”这一小节会详细介绍。

#### bin

bin字段的主要目的是：为包配置一个命令名称与处理该命令的本地文件的映射对象。当该包被安装时，npm会自动根据bin字段中配置的命令名和处理文件生成一个可执行文件。并且根据安装方式的不同，允许用户之间或者间接在shell中运行该命令。

bin字段的值是一个对象，它的值是命令名和本地文件映射的对象。例如：

```json
{
    "bin": {
        "myapp": "./cli.js"
    }
}
```

上面的配置了一个my-app的命令。其运行原理和使用方式参考下文<a href="bin">bin字段的原理</a>。

#### scripts

scripts字段是一个字典，它可以配置在包的生命周期的不同时间运行的脚本命令，也可以配置用户自定义的命令。生命周期命令是自动调用的，而用户自定义的命令是通过终端手动执行`npm run-scripts`命令调用的。其生命周期及配置参考下文[scripts字段详解](#scripts字段详解)。

### 依赖项配置

依赖项配置存放的是当前包的依赖包信息，它是一个简单的对象，它的key是一个依赖包的名称，但是它的value有下面几个类型：

1. 包的版本范围。有关版本范围可以查看[semver](https://github.com/npm/node-semver#versions)。
2. 存放依赖的url。
3. git包地址。它可以是一个git url，也可以是GitHub URLs。
4. 在发布是被特定标签标记的版本的包。
5. 一个本地路径。

关于包名称映射的值可以查看[官网](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#dependencies)。

#### dependencies

配置的是当前包在生产环境被依赖的包。比如一些工具包。

#### devDependencies

配置的当前包在开发时才会需要的依赖项。比如测试框架、打包工具、编译工具等。当有人在它们的应用程序中下载或者使用你发布的包，它们可能不需要下载和构建你在开发时使用的这些包，在这种情况下，你最好把这些依赖项安装到devDependencies中。

#### peerDependencies

在npm官网中[关于该字段的描述](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies)可能令人有些难以理解，但是在node.js有篇[博客](https://nodejs.org/es/blog/npm/peer-dependencies/)对于该字段进行了详细的解释。

peerDependencies配置的依赖被称为对等依赖，什么意思呢？

对于普通包来讲，当一个包作为依赖包在项目中被使用的时候，会同时安装依赖包中`dependencies`字段中配置的依赖包，即使是传递依赖。

但是还有一种包，通常被称为插件包，插件包只有和另一个包（被称为主机包，“host” package）一起使用才有意义，即使它不一定直接使用主机包，更重要的是它们只能和特定版本的主机包一起使用。例如`react-redux@8.0.2`只适合“^16.8 || ^17.0 || ^18.0”版本的react包。

作为包管理器，安装依赖项时npm的很大一部分工作是管理它们的版本。大多数插件实际上从不依赖于他们主机包，即使把主机包作为依赖项，被下载的主机包也永远不会使用；即使存在这种直接依赖关系的插件，也可能由于在项目中（或者是“宿主”）已经安装了主机包，导致依赖关系树中存在多个主机包的副本。

所以我们实际需要的是能够在插件包和它们的宿主之间表达这种“依赖”的方式：即我只在插入我的主机的1.2.x版本时工作，如果你安装我，请确保它与兼容的主机包一起使用”，我们称这种关系为对等依赖。也就是说宿主和插件对等依赖主机包。

对等依赖项需要用户手动添加到package.json中。

```json
{
    "name": "react-redux",
    "peerDependencies": {
        "react": "^16.8 || ^17.0 || ^18.0"
    }
}
```

#### peerDependenciesMeta

在npm v7版本之后，npm会自动安装依赖包的package.json中peerDependencies`字段中配置的对等依赖。

- 如果我们的工程中没有安装对等依赖，则会自动安装。
- 如果我们的工程中已经安装了对等依赖，但是版本不符合，则会报错，安装失败。
- 如果我们工程中安装了对等依赖，且版本符合，则不报错。

peerDependenciesMeta字段用于配置插件包中的对等依赖是否可选的。如果对等依赖包是可选的，我们的工程中没有安装对等依赖时，npm不会自动安装。

#### bundleDependencies

bundleDependencies被我翻译为捆绑依赖（大概意思和捆绑销售差不多，哈哈）。有时候我们在发布包时，可能需要将某些依赖包一起打包，所以package.json中提供了bundleDependencies字段，定义在执行`npm pack`命令时需要被捆绑的包。

当bundleDependencies的值是数组的时候，该值是需要被捆绑的包名称的数组；该字段的值也可以是boolean值，当值为true是，将捆绑所有的依赖包，当值为false的时候，不捆绑任何依赖包。需要注意的是，bundleDependencies中只包含包名称，版本信息是在dependencies中定义的。

例如下面的配置，当我们执行`npm pack`得到`awesome-web-framework-1.0.0.tgz`文件，该文件会包含`rendeerized`和`super-streams`.

```json
{
  "name": "awesome-web-framework",
  "version": "1.0.0",
  "bundleDependencies": [
    "renderized",
    "super-streams"
  ]
}
```

#### optionalDependencies

optionalDependencies 是可选依赖，如果有一些依赖包即使安装失败，项目仍然能够运行或者希望 npm 继续运行，就可以使用 optionalDependencies。另外 optionalDependencies 会覆盖 dependencies 中的同名依赖包，所以不要在两个地方都写 。

#### overrides   

某些情况下，我们可能需要对依赖项的依赖项进行修改，比如用安全版本替换依赖项版本。也就是说，通常我们项目中的某个依赖包中定义了自己的依赖，但是我们需要在我们项目中，修改该依赖包中某个依赖的版本，这时候就用到了overrides字段。

该字段的使用有下面几点需要注意：

- 你需要根据当前依赖树的结构，覆盖后代依赖包的版本。

  ```json
  // 重写foo包版本为1.0.0, 及其后代中bar包的版本为1.0.0
  {
    "overrides": {
      "foo": {
        ".": "1.0.0",
        "bar": "1.0.0"
      }
    }
  }
  ```

  // 或者

  ```json
  // 只重写bar包的后代依赖中的foo的版本为1.0.0
  {
    "overrides": {
      "bar": {
        "foo": "1.0.0"
      }
    }
  }
  ```

- 你也限制修改某个版本的依赖包的后代依赖。

  ```json
  // 只重写2.0.0版本的bar包后代依赖中的foo包。
  {
    "overrides": {
      "bar@2.0.0": {
        "foo": "1.0.0"
      }
    }
  }
  ```

- 你不能在你的项目中，覆盖直接依赖项的版本。

  ```json
  {
      "dependencies": {
          "foo": "^1.0.0"
      },
      "overrides": {
          "foo": "$foo",
          "bar": "$foo"
      }
  }
  
  ```

### 包配置

#### man

[`man`](https://en.wikipedia.org/wiki/Man_page)是用于阅读软件手册的标准 UNIX 命令行工具。`man`字段特定于 *nix 并且在 Windows 上仍然未使用，至少没有[额外的措施](https://stackoverflow.com/questions/944434/where-is-the-man-program-for-windows-program-to-open-unix-man-pages)。这个字段使用的不多，至少我目前还没有见过。

#### private

如果该字段的值设置为true，则 npm 将拒绝发布它。这是一种防止意外发布私有存储库的方法。如果您希望确保给定的包只发布到特定的仓库(例如，公司的私有库) ，那么在发布时使用下面描述的 PublishConfig 字典覆盖注册中心配置参数。

#### directories

#### config

config对象被用于设置一个可以在“scripts”字段中使用的配置对象。例如：

```javascript
{
    "name": "foo",
    "config": {
        "port": "8080"
    }
}
```

那么就可以在`scripts`中通过类似“npm_package_config_port”引用该环境变量。

#### publishConfig

这是一组在发布时使用的配置值，如果你想要设置包的标签，仓库和访问权限，在[config](https://docs.npmjs.com/cli/v8/using-npm/config)中查看可以被设置的值。

#### workspaces

workspaces

### 环境配置

#### engines

通过engines字段，你可以指定允许执行当前包的node版本，并且也可以指定允许安装当前包的npm版本。

```json
{
    "engines": {
        "node": ">=0.10.3 <15",
        "npm": "~1.0.20"
    }
}
```

如果你没有指定版本（或者指定版本为“ * ”），那么任何版本的node和npm都可以。

并且除非用户设置了`engine-strict`配置标记，否则该字段只是建议性的，仅仅是在安装包时产生警告而已。

#### os

os字段的值是一个数组，你可以指定允许当前包运行的操作系统，也可以阻止当前包允许的操作系统（只需要在操作系统名称前加“ ! ”前缀）。下面的实例表示允许在linux操作系统运行，但是不允许在win32操作系统运行。

node判断的依据来自于`process.platform`的值。

```json
{
    "os": [
        "linux",
        "!win32"
    ]
}
```

#### cpu

和os字段一样，你可以通过这个字段指定允许运行当前包的cpu架构，和不允许当前包运行的cpu架构。实例如下：

```javascript
{
    "cpu": [
        "x64",
        "ia32",
        "!arm",
        "!mips"
    ]
}
```

node判断cpu架构的依据来自于`process.arch`的值。

## 常见问题

### main、browser、module字段的区别

npm官网中对[package.json](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#main)的介绍中，只有main和browser字段，但是有时我们还可能见到另一个字段[moudle](https://stackoverflow.com/questions/42708484/what-is-the-module-package-json-field-for)，那么moudle是什么呢？main、browser、moudle字段之间的区别是什么？它们的使用场景有什么不同？

esbuild的[文档](https://esbuild.github.io/api/#main-fields)中介绍了这几个字段：

- main。这是所有在node中使用的包的标准字段，该名称"main"被硬编码到node模块解析逻辑本身。因为它是为node使用而设计的，并且早期node仅支持CommonJS模块规范，因此，我们可以合理的认为main字段中配置的文件是CommonJS风格的模块。
- moudle。该字段来源于一项如何把ECMAScript的模块方案集成到node中的一些提案，因此该字段配置的文件中应该是ESM风格的模块。但是该提案没有被node采用（使用"type": "module"替代），但是该字段被主要的模块打包器采用了，因为ESM风格的模块能够很好的支持Tree Shirk。
- browser。该字段也是被定义在packag.json中的标准字段，该字段来自于一个[提案](https://gist.github.com/defunctzombie/4339901/49493836fb873ddaa4b8a7aa0ef2352119f69211)，该提案允许打包器使用适用于浏览器的模块替换适用于node的文件或模块。当然，一个包可以同时拥有`browser`和`module`字段。

### <span id="bin">bin字段的原理</span>

我们在开发中，经常会用到一些命令行工具包，如脚手架工具vue-cli，还有打包工具webpack。那么这些命令是被如何配置的？命令又是如何被调用的呢？

#### 命令配置

首先是该命令是如何被配置的。这就是package.json中bin字段的作用了。 bin字段的值是一个对象，它允许用户配置“命令名”和“命令处理文件”的映射。比如下面这个例子中，我们配置了一个`webpack`的命令，并且当该命令被调用时，使用本地的`bin/webpack.js`脚本处理这个命令的调用。

```json
{
    "bin": {
        "webpack": "bin/webpack.js"
    }
}
```

对于处理命令的.js文件，你需要在文件第一行添加“shebang”行，它告诉操作系统使用哪个解释器来运行脚本。

```javascript
#!/usr/bin/node
```

上面的“sehebang”行告诉操作系统使用node来执行文件，但是并非所有的操作系统的bin文件夹中都有node，但应该都有`env`，你可以告诉操作系统使用node为参数运行`env`。

```javascript
#!/usr/bin/env node
```

#### 操作系统添加命令

要了解bin字段中配置的命令是如何被运行的，首先要了解如何在操作系统中添加命令。

无论是*inux还是windows都可以通过添加系统变量，来直接在shell中执行文件。下面以windows为例：

1. 我们首先在一个在`D:`盘下新建`myCmd`的文件夹。

2. 将该文件夹添加到系统环境变量的`path`变量中

3. 在`D:\myCmd`文件夹下新建“hello.cmd”文件，并在文件中写入以下命令。

   ```shell
   echo Hello World
   ```

4. 在windows终端中输入命令"hello"，可以看到控制台输出了"hello world"字样。

也就是当我们在系统环境变量中添加一个文件夹路径时，该文件夹下的可执行文件（bat、cmd等文件）就可以直接使用命令执行，而该可执行文件的文件名就被作为了调用的命令。

#### 从命令行运行node.js脚本

npm包有两种安装方式：本地安装和全局安装。但是无论是那种安装方式，npm都会根据包内package.json文件中的bin字段配置的命令，生成相应的`.cmd`和`.ps1`可执行文件。只是可执行文件存储的位置不同。

- 当包被安装到全局时，通过`npm root -g`命令能够获取全局安装位置，并得到node的安装位置。 此时可以看到npm生成的可执行位置被放到了node的安装目录下。
- 当包被本地安装时，可以看到项目的`node_modules`目录下包含一个`bin/`文件夹，可执行文件被放到了该文件夹下。

那么此时npm生成的可执行文件是如何被调用的呢？

- 对于全局安装的包的命令，通常情况下node被安装时，node的安装目录就已经被添加到系统环境变量了，此时可以直接运行安装目录下的可执行文件。
- 对于本地安装的包，通常在package.json的scripts字段中被使用，此时通过`npm run-scripts`命令运行时，会将`node_module/.bin`目录添加到系统环境变量中，执行结束后，再将该变量删除。

以上就是package.json中命令的配置及运行原理了。

### `scripts`字段详解

npm脚本是用户使用最多的功能，它的主要作用就是构建一个工作流：使用脚本来执行一些重复性任务，例如删除临时文件等。package.json中的scripts允许用户配置npm脚本，scripts就像通常的JSON键值对一样编写，**其中键是脚本的名称，值是你要执行的脚本**。它的配置方式如下：

```json
{
    "scripts": {
        "say-hello": "echo 'Hello World'"
    }
}
```

你可以在控制台执行`npm run say-hello`命令执行上面的脚本，并在控制台打印“Hello World”。

上面的例子说明npm脚本的一个重要方面：它们只是终端命令。它们在执行它们的操作系统中的shell运行，可能是Linux的bash和Windows的cmd.exe。

#### 可配置的脚本

scripts中执行的脚本是多样的。比如下面可执行的类型。

- 在其他 npm脚本中调用 npm脚本。

  ```json
  {
      "scripts": {
          "say-hello": "echo 'Hello World'",
          "awesome-npm": "npm run say-hello && echo 'echo NPM is awesome!'"
      }
  }
  ```

- 调用shell和node脚本。也可以在npm脚本中调用shell或者js脚本，以实现更复杂的功能。

  1. 创建一个hello.sh文件，并在文件输入以下内容。

     ```sh
         #!/usr/bin/env bash
     
         # filename: hello.sh
         echo "What's your name?"
         read name
         echo "Hello there, $name!"
     ```

  2. 在scripts中执行bash脚本。当然，你也可以通过js脚本来做通用的事情，但是你可能需要在js脚本中编写命令行参数获取等代码。

     ```json
     {
         "bash-hello": "bash hello.sh"
     }
     ```

#### Pre&Post脚本

用户可以配置脚本的钩子：Pre和Post的钩子，Pre钩子在脚本执行之前被调用，Post钩子在脚本被执行知乎调用。例如我们为之前配置的`say-hello`脚本配置钩子：

```json
    "scripts": {
        "say-hello": "echo 'Hello World'", 
        "presay-hello": "echo 'I run before say-hello'",
        "postsay-hello": "echo 'I run after say-hello'" 
    }
```

#### scipts生命周期

除了用户自定义的脚本，以及Pre和Post脚本，npm还可以配置npm包声明周期执行的脚本。

包括`prepare`、`prepublish`、 `prepublishOnly`、 `prepack`、`postpack`、`dependencies`等，在[npm官网](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)我们可以看到这个声明周期脚本的执行时机。

#### 使我们的脚本跨平台

在脚本中编写的终端/shell命令有一个缺点，就是shell命令使我们的脚本依赖于平台：如果你的脚本是为了*nix系统编写的，它可能无法在Windows上运行，反之亦然。

解决这个问题有三种方式：

1. 仅使用跨平台运行的命令。许多有用的命令在Linux和Windows中是通用的，如果你的脚本很简单，考虑使用它们。
2. 使用node包：你可以使用[rimraf](https://www.npmjs.com/package/rimraf)和[cross-env](https://www.npmjs.com/package/cross-env)等node包，代替shell命令，如果你的脚本太过复杂，可以考虑在js文件中使用它们。
3. 使用ShellJS: [ShellJS](https://www.npmjs.com/package/shelljs)是一个通过Node运行Unix命令的npm包，因此你能够在Windows平台内运行所有Unix命令。

 
