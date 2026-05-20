# process 模块

`process` 是一个全局对象，提供了与当前 Node.js 进程交互的多种方法和属性。通过 `process` 对象，开发者可以获取进程信息、控制进程行为，以及处理与操作系统的交互。

## `process.env`

`process.env` 是 Node.js 提供的一个对象，包含了系统的环境变量（Environment Variables）。
它允许我们在 Node.js 代码中访问、修改和使用环境变量，这在配置管理、安全性、跨平台兼容性等方面非常重要。

- `process.env` 是一个对象（Object），其中的每个键值对都是环境变量。
- 你可以通过 `process.env.VARIABLE_NAME` 访问某个特定的环境变量。
- 在 Windows 和 Unix 系统（Linux/macOS） 上，`process.env` 的行为略有不同。

### 基本用法

1. 读取环境变量
```javascript
console.log(process.env.PATH);  // 输出系统的 PATH 变量
console.log(process.env.NODE_ENV);  // 读取 NODE_ENV 变量
console.log(process.env.HOME);  // Unix 系统的用户主目录
console.log(process.env.USERPROFILE);  // Windows 系统的用户目录
```

2. 设置环境变量

```javascript
process.env.MY_VAR = "Hello World";
console.log(process.env.MY_VAR);  // 输出 "Hello World"
```

注意：
- 仅对当前进程有效，不会影响全局系统环境变量。
- 不能删除环境变量（delete process.env.MY_VAR 可能无效）。

## `process.argv`

`process.argv`返回一个数组，包含启动 Node.js 进程时传递的命令行参数。

-   该数组的第一个元素是 Node.js 可执行文件的路径。
-   第二个元素是当前执行的 JavaScript 文件路径。
-   剩余的元素是用户传递的自定义命令行参数。

### 基本用法

假设有一个脚本 args.js：

```javascript
console.log(process.argv);
```

如果在终端执行：

```sh
node args.js argv1 argv2=val2 -argv3 val3
```

输出：

```sh
[
  'D:\\SDK\\nvm\\nodejs\\node.exe', // Node.js 可执行文件路径
  'D:\\front\\test\\args.js',   // 正在执行的脚本路径
  'argv1',   // 额外参数
  'argv2=val2',
  '-argv3',
  'val3'
]
```

### 使用场景

#### 提取用户参数

因为 node 的参数可能是多种形式的，例如`argv1=val1`、`-argv2 value`，所以自己去解析命令行的参数还是很复杂的，在实际开发中，可以使用 `yargs` 或 `commander.js` 解析参数。

## `process.argv0`

`process.argv0` 是 Node.js 提供的一个属性，它存储了进程启动时传递的 `argv[0]` 的原始值。

该属性是只读的，不能修改。

-   `process.argv0` 与 `process.argv[0]` 在大多数情况下是相同的，但在某些场景下可能会有所不同。
-   `process.argv0` 主要用于保留进程启动时的原始可执行文件名称，即使 `process.execPath` 发生了变化。

### vs process.argv[0]

-   `process.argv0`

存储的是启动 Node.js 进程时 `argv[0]` 传入的原始值。
该值在整个进程生命周期内保持不变，不受 `process.execPath` 影响。

-   `process.argv[0]`

`process.argv[0]` 通常与 `process.argv0` 相同，但可能会因 `execPath` 变化而受到影响。
`process.argv[0]` 可以反映当前 Node.js 可执行文件的路径。

## 信号

## `process.cwd()`

用于获取进程的**当前工作目录**（Current Working Directory, CWD），即**启动 Node.js 进程的目录**。返回的是当前工作目录的绝对路径（字符串）。

### 与`__dirname` 的区别

| 对比项       | process.cwd()          | \_\_dirname                  |
| ------------ | ---------------------- | ---------------------------- |
| 作用         | 返回当前工作目录       | 返回当前文件所在目录         |
| 受影响的情况 | 受 process.chdir()影响 | 不受影响，始终是文件所在目录 |

假设项目目录如下：

```swift
/home/user/my_project/
  ├── app.js
  ├── utils/
  │   ├── helper.js
```

如果 helper.js 代码如下：

```javascript
console.log("process.cwd():", process.cwd());
console.log("__dirname:", __dirname);
```

在 `my_project` 目录下执行：

```sh
node utils/helper.js
```

可能的输出：

-   `process.cwd(): /home/user/my_project`
-   `__dirname: /home/user/my_project/utils`

可以看出：

-   `process.cwd()` 返回的是启动 Node.js 进程的目录。
-   `__dirname` 返回的是当前文件所在目录（helper.js 所在的 utils/ 目录）。

### 使用场景

#### 解决相对路径问题

在 Node.js 中，相对路径通常相对于 `process.cwd()`，而不是当前文件路径：

```javascript
// app.js
const fs = require("fs");

fs.readFileSync("./config.json", "utf8"); // 以 CWD 为基准查找文件
```

1. 如果当前目录是`/home/user/my_project/`，`config.json`放在该目录下。

2. 但如果用户在`/home/user`目录下执行：

```sh
cd /home/user && node my_project/app.js
```

则 `fs.readFileSync('./config.json', 'utf8')`会在`/home/user/config.json`查找文件，而不是 `my_project` 内部！

3. 确保文件路径正确
   可以使用`path.resolve()`结合`process.cwd()`构造绝对路径：

```javascript
// app.js
const path = require("path");
const fs = require("fs");

const configPath = path.resolve(__dirname, "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
console.log(config);
```

这样无论从哪个目录运行`node app.js`，都能正确读取`config.json`。

#### 在 CLI 工具中确定用户执行路径

`process.cwd()`在命令行工具（CLI）中尤为重要，因为它能动态获取用户在哪个目录运行命令：

```javascript
console.log(`当前用户在 ${process.cwd()} 目录下运行此命令`);
```

#### 确保跨平台兼容

某些操作系统（如 Windows 和 Linux）路径格式不同，可以结合 `process.cwd()` 和 `path` 进行跨平台处理：

```javascript
const path = require("path");

const filePath = path.join(process.cwd(), "data", "file.txt");
console.log("跨平台路径:", filePath);
```

这样无论是在 Windows (`C:\\Users\\name\\data\\file.txt`) 还是 Linux (`/home/user/data/file.txt`)，都能正确处理路径。

## `process.abort()`

用于立即终止当前进程并生成一个核心转储文件（core dump）。核心转储文件包含了进程在终止时的内存快照，对于调试和诊断问题非常有用。

```javascript
console.log("进程即将终止并生成核心转储文件。");
process.abort();
console.log("这行代码不会被执行。");
```

需要注意的是：

-   不可在 Worker 线程中使用： `process.abort()` 方法在 Worker 线程中不可用。
-   与 `process.exit()` 的区别： `process.exit()`方法用于终止当前进程，并可以指定退出码，但不会生成核心转储文件。相比之下，`process.abort()` 会生成核心转储文件，提供更详细的调试信息。

### 使用场景

`process.abort()` 主要用于以下情况：

#### 检测到不可恢复的错误。

例如，Node.js 的关键组件（如数据库连接、配置加载等）出现严重错误，继续运行会导致不可预测的行为。

```javascript
const fs = require("fs");

try {
    const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
    if (!config.databaseUrl) {
        console.error("配置文件损坏：缺少 databaseUrl！");
        process.abort(); // 立即终止并生成 core dump
    }
} catch (error) {
    console.error("无法加载配置文件:", error);
    process.abort(); // 终止进程
}

console.log("这行代码不会被执行");
```

#### 调试 & 生成核心转储

在本地、测试或生产环境中调试严重错误，有时需要人为制造崩溃，可以通过`process.abort()`生成 core dump 进行分析。

#### 进程进入异常状态

例如，检测到内存泄漏、资源耗尽等无法继续安全运行的情况。示例：在未捕获的异常中使用`process.abort()`。

```javascript
process.on("uncaughtException", (err) => {
    console.error("发生未捕获异常:", err);
    process.abort(); // 生成 core dump 以便后续分析
});

throw new Error("致命错误！");
```