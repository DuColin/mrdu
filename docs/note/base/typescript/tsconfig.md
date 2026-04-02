# tsconfig 配置文件

tsconfig.json 是 typescript 的配置文件，该文件所在的目录表示当前目录是 typescript 项目的根目录。使用 tsconfig.json 最重要的有两个目的：
- 指定待编译的文件。
- 配置编译选项。

当然，该配置文件也可以是其他名字，但你必须显式其路径。它有两种使用方式：
- 运行 tsc 命令时，通过`--project`或者`-p` 命令行选项显示指定 tsconfig.json 文件的目录，或者直接指定.配置 json 文件的路径。
- 若运行 tsc 命令时没有显式指定该文件或文件目录的时候，编译器会从当前目录开始，并向父目录开始查找该文件。

tsconfig.json 文件主要包含 5 个大的配置项："files"、"include"、"exclude"、"compilerOptions"、"extends"。

## 基本配置项

- files
    需要编译的单个文件的列表。可以使用相对或者绝对路径。当然，该配置项只适用于引入少量文件。

```json
{
	"files": ["./utils/typeHeler.ts", "test.ts"]
}
```

-   include
    需要编译的文件或目录。它支持 global 通配符。

```json
{
	"include": ["src", "scripts/**/*", "test/*"]
}
```

- exclude
    需要排除的文件或目录，仅用于更排除掉`"include"`设置中包含的文件。虽然它能够过滤掉`"include"`引入的文件，但是`files`和`<reference>`明确指定的文件却会始终包含在内。默认情况下回排除掉 `node_modules`、`bower_components`、`jspn_packages`目录和`<outDir>`目录。

```json
{
    "exclude": {
        "dist",
        "node_"
    }
}
```

> 默认情况下，编译器包含需要编译的目录及子目录下所有的 TypeScript 文件（`.ts`、`.d.ts`、`.tsx`）文件。
>
> `"include"`和`"exclude"`配置时可以使用 globa 通配符：
>
> -   `*`匹配 0 或多个字符（不包含目录分隔符）
> -   `?`匹配任意一个字符（不包含目录分隔符）
> -   `**/`递归匹配任意子目录

- extends

## compolierOptions

### 类型检查

- allowUnreachableCode（允许不可访问的代码）
  不可访问的代码即那些永远不可能被执行的代码。allowUnreachable 配置项决定我们如何处理那些永远不会被执行的代码。它有三个值：
  - undefined（默认）：编译时抛出建议作为 wraning。
  - true：不可访问的代码会被忽略掉，即允许存在不可访问的代码。
  - false：抛出一个不可访问代码的相关编译错误。

- allowUnusedLabels（允许未使用的标签）
  虽然通常标签在 javascript 中使用非常少。但是 ts 依然提供了针对标签的配置选项。它也有三个值：
  - undefined（默认）：编译时在编辑器中抛出建议作为 warning。
  - true：未被使用的标签会被忽略掉，允许存在未被使用的标签。
  - false：抛出一个关于存在未被使用的标签的错误。

- alwaysStrict
  确保文件使用严格模式进行解析。

#### exactOptionalPropertyTypes（精确的可选属性类型）

#### noFallthroughCasesInSwitch（在 Switch 没有落空 Case）

#### mapRoot

#### moduleResolution

[1]: https://www.gitmemory.com/issue/ant-design/ant-design-pro/8158/791277893 'tsconfig中的jsx配置'
[2]: https://zhuanlan.zhihu.com/p/148081795 'esModuleInterop 到底做了什么？'
[4]: https://blog.csdn.net/lunahaijiao/article/details/115451427 'TypeScript 4.3 beta 版本正式发布......'
[5]: https://blog.csdn.net/weixin_40906515/article/details/102855234 'Typescript 严格模式有多严格？'
[6]: https://mariusschulz.com/blog/downlevel-iteration-for-es3-es5-in-typescript 'Downlevel Iteration for ES3/ES5 in TypeScript'
[8]: https://indepth.dev/posts/1164/configuring-typescript-compiler '配置 TypeScript 编译器'
