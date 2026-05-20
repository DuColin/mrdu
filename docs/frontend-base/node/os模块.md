# OS模块

## `os.homedir()`
`os.homedir()`用于获取当前用户的主目录（Home Directory）。

> 主目录（Home Directory） 是每个用户在操作系统中的默认个人文件夹，通常用于存放配置文件、文档、下载内容等。

### 使用场景

1. 构造用户配置文件路径
可以使用 os.homedir() 来确定用户的 .config、.bashrc 或 .npmrc 配置文件路径：

```javascript
const path = require('path');
const os = require('os');

const configPath = path.join(os.homedir(), '.config', 'myapp', 'config.json');
console.log(`配置文件路径：${configPath}`);
```

2. 读取或创建用户配置文件

```javascript 
const fs = require('fs');
const os = require('os');
const path = require('path');

const configFilePath = path.join(os.homedir(), '.myappconfig.json');

// 检查配置文件是否存在
if (!fs.existsSync(configFilePath)) {
    fs.writeFileSync(configFilePath, JSON.stringify({ theme: 'dark' }, null, 2));
    console.log('已创建默认配置文件');
} else {
    console.log('配置文件已存在');
}
```
3. 在跨平台环境中正确存储用户数据

在跨平台应用（如 Electron、CLI 工具）中，os.homedir() 允许我们动态获取用户
目录，而不是硬编码路径：

```javascript 
const os = require('os');
const path = require('path');

const userDataDir = path.join(os.homedir(), 'myAppData');
console.log(`数据存储目录：${userDataDir}`);
```

### 在不同系统上的行为

|操作系统 |典型返回值              |
|--------|-----------------------|
|Windows |C:\Users\Administrator |
|Linux	 |/home/username         |
|macOS	 |/Users/username        |

特殊情况
- 如果 HOME 环境变量被删除，Windows上会回退到 USERPROFILE，而 Linux/macOS 则可能抛出错误或返回/目录。
某些嵌入式系统（如 Docker 容器）可能会返回 /root（如果是 root 用户）。

### os.homedir() vs process.env.HOME

|方法	                  |跨平台支持	       |可靠性	         |适用场景                           |
|------------------------|--------------------|----------------|-----------------------------------|
|os.homedir()	         |✅ 高	            |✅ 高	        |推荐，适用于所有系统                 |
|process.env.HOME        |❌ 仅 macOS/Linux  |❌ 低（可能为空）|适用于 macOS/Linux，Windows 上不可用 |
|process.env.USERPROFILE |❌ 仅 Windows	    |❌ 低（可能为空）|适用于 Windows，macOS/Linux 不支持   |

`process.env.HOME` 只适用于 Linux/macOS，在 Windows 上 HOME 变量可能为空，正确的变量是 `USERPROFILE`，因此 `os.homedir()` 是最安全的跨平台方案。

## `os.freemem()`

用于获取系统当前可用的内存（空闲 RAM 大小），单位为 字节（bytes）。

### 使用场景

1. 监测系统可用内存

如果你的应用需要大量 RAM（如处理大文件或运行 Web 服务器），可以用 os.freemem() 来检查是否有足够的可用内存：

```javascript
const os = require('os');

const minMemoryRequired = 2 * 1024 * 1024 * 1024; // 2GB
const freeMemory = os.freemem();

if (freeMemory < minMemoryRequired) {
    console.warn('警告：系统可用内存不足，可能会影响性能！');
} else {
    console.log('系统内存充足，可以正常运行');
} 
```

## `os.cpus()`

用于获取关于计算机 CPU（中央处理单元）的信息，返回包含每个逻辑 CPU 核心信息的对象数组。

```javascript
[
    {
        model: '13th Gen Intel(R) Core(TM) i5-13500H',
        speed: 3187,
        times: {
            user: 2951187,
            nice: 0,
            sys: 2662171,
            idle: 352910796,
            irq: 172328
        }
    },
    { ... } // 其他CPU核心
]
```

字段说明：
|字段      |说明                            |
|----------|-------------------------------|
|model     |CPU 型号（如 Intel、AMD）       |
|speed     |处理器频率（MHz）               |  
|times.user|用户模式下的 CPU 时间           |
|times.nice|低优先级进程 CPU 时间（通常为 0）|
|times.sys |内核模式下的 CPU 时间           |
|times.idle|CPU 空闲时间                   |
|times.irq |处理中断请求的时间              |

`nice`值仅适用于 `POSIX`。在 Windows上，`nice`所有处理器的值始终为 0。

需要注意的是：
- `times` 中的时间是从系统启动开始累积的，单位是毫秒。
- 这些值不会自动重置，除非系统重启或进入睡眠（部分系统）。
- 单位是毫秒，但受限于操作系统，某些情况下可能是更低精度的时钟滴答（tick）。

### 用户模式和内核模式

CPU 运行时主要有两种模式：用户模式（User Mode） 和 内核模式（Kernel Mode）。它们是 CPU 权限等级（privilege level）的一部分，控制着 CPU 运行代码时的权限范围。

**用户模式**是 CPU 权限较低 的运行模式，主要用于运行应用程序（普通软件）。 例如：
- 浏览器
- 文本编辑器
- 终端应用
- 其他非系统级的进程

在用户模式下：
- 只能访问受限的内存区域，无法直接访问系统核心资源（如硬件设备、I/O 端口）。
- 不能直接执行特权指令（例如修改内存管理、控制中断等操作）。
- 如果应用程序需要访问系统资源（如文件、网络、设备），必须通过 系统调用（syscall） 请求操作系统的内核来完成。

**内核模式**是 CPU 权限最高 的运行模式，主要用于操作系统内核（Kernel） 和 驱动程序 执行关键任务，例如：
- 进程管理
- 内存管理
- 硬件驱动（磁盘、网络、USB）
- 访问文件系统

在内核模式下： 
- 可以访问 所有的内存地址，包括操作系统的内存区域。
- 能够执行 所有 CPU 指令，包括特权指令（如修改 CPU 的控制寄存器、管理中断、直接访问硬件）。
- 如果程序在内核模式下出错（如非法访问内存），会导致 整个系统崩溃（蓝屏、内核崩溃），而不是单个应用程序崩溃。

## `os.availableParallelism()`

`os.availableParallelism()`始终返回大于零的值， 主要用于**获取可用的并行 CPU 核心数量**。它类似于`os.cpus().length`。

|方法                      |作用	                    |是否受 CPU 亲和性（CPU Affinity）影响   |性能  |
|--------------------------|----------------------------|-------------------------------------|-------|
|os.availableParallelism() |返回当前进程可用的CPU核心数   |✅ 受影响 	                        |✅更快|
|os.cpus().length          |返回物理 CPU 的所有逻辑核心数 |❌ 不受影响                           |⏳较慢|

在多线程或并行计算中，了解系统的并行处理能力非常重要。它可以帮助你优化应用程序的性能，例如在创建线程池或分配任务时，合理利用系统的 CPU 资源。

### 使用场景

1. 多线程编程（如 worker_threads）

避免创建**超过可用核心数**的 Worker 线程，提高并行计算的效率

```javascript 
const { Worker } = require('worker_threads');
const os = require('os');

const numThreads = os.availableParallelism();
console.log(`Spawning ${numThreads} workers...`);

for (let i = 0; i < numThreads; i++) {
    new Worker('./worker.js'); // 创建多个 worker 线程
}
```

2. 优化 cluster 模块的工作进程

    避免 cluster.fork() 创建过多的子进程，提高资源利用率。

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    const numWorkers = os.availableParallelism();
    console.log(`Forking ${numWorkers} workers...`);

    for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }
} else {
    require('./server'); // 启动 HTTP 服务器
}
```

## `os.platform()` 

`os.platform()` 方法返回一个字符串，表示 Node.js 进程运行所在的操作系统平台。这个字符串标识符是 Node.js 内部定义的，用于统一表示不同操作系统平台。以下是 `os.platform()` 方法可能返回的值：

- `'aix'`：IBM AIX 操作系统
- `'darwin'`：macOS 操作系统
- `'freebsd'`：FreeBSD 操作系统
- `'linux'`：Linux 操作系统
- `'openbsd'`：OpenBSD 操作系统
- `'sunos'`：SunOS 操作系统
- `'win32'`：Windows 操作系统
- `'cygwin'`：Cygwin POSIX 仿真层
- `'android'`：Android 操作系统


## `os.arch()`

`os.arch()`用于获取操作系统的 CPU 架构。

|返回值   |说明                                   |
|--------|---------------------------------------|
|'x64'	 |64 位架构（常见，如 Intel/AMD 处理器）    |
|'arm'	 |ARM 32 位架构（低功耗设备，如树莓派）      |
|'arm64' |ARM 64 位架构（Apple M1/M2、部分移动设备）|
|'ia32'	 |32 位架构（较旧的 Intel 处理器）          |
|'mips'	 |MIPS 处理器（嵌入式设备）                 |
|'mipsel'|低端 MIPS 处理器（嵌入式设备）            |
|'ppc'	 |PowerPC 处理器                          |
|'ppc64' |64 位 PowerPC                           |
|'s390'	 |IBM System z 处理器                     |
|'s390x' |64 位 IBM System z                     |

### 使用场景
1. 判断 CPU 架构，选择合适的二进制文件
有些程序在不同架构下需要使用不同的可执行文件，例如：

```javascript
const os = require('os');

const arch = os.arch();
const binaries = {
    x64: 'binary-x64.exe',
    arm: 'binary-arm.exe',
    arm64: 'binary-arm64.exe',
    ia32: 'binary-ia32.exe'
};

console.log(`Using binary: ${binaries[arch] || 'unsupported-arch'}`);
```

2. 提供架构信息给日志或调试

```javascript
console.log(`Running on a ${os.arch()} CPU`);
```

3. 检查架构并阻止不兼容运行

```javascript 
if (os.arch() === 'ia32') {
    console.error("This application does not support 32-bit systems.");
    process.exit(1);
}
```