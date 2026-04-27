import{_ as s,c as a,o as p,ae as e}from"./chunks/framework.CMFi8ROq.js";const f=JSON.parse('{"title":"源码解析","description":"","frontmatter":{},"headers":[],"relativePath":"note/framework/vue/源码解析.md","filePath":"note/framework/vue/源码解析.md","lastUpdated":1775100313000}'),l={name:"note/framework/vue/源码解析.md"};function i(c,n,t,o,r,d){return p(),a("div",null,n[0]||(n[0]=[e(`<h1 id="源码解析" tabindex="-1">源码解析 <a class="header-anchor" href="#源码解析" aria-label="Permalink to &quot;源码解析&quot;">​</a></h1><h2 id="源码目录" tabindex="-1">源码目录 <a class="header-anchor" href="#源码目录" aria-label="Permalink to &quot;源码目录&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>├── dist</span></span>
<span class="line"><span>├── flow</span></span>
<span class="line"><span>├── scripts</span></span>
<span class="line"><span>├── src</span></span>
<span class="line"><span>|  ├── compiler</span></span>
<span class="line"><span>|  |  ├── codegen</span></span>
<span class="line"><span>|  |  ├── directives</span></span>
<span class="line"><span>|  |  └── parser</span></span>
<span class="line"><span>|  ├── core</span></span>
<span class="line"><span>|  |  ├── components</span></span>
<span class="line"><span>|  |  ├── global-api</span></span>
<span class="line"><span>|  |  ├── instance</span></span>
<span class="line"><span>|  |  ├── observer</span></span>
<span class="line"><span>|  |  ├── util</span></span>
<span class="line"><span>|  |  └── vdom</span></span>
<span class="line"><span>|  ├── platforms</span></span>
<span class="line"><span>|  |  ├── web</span></span>
<span class="line"><span>|  |  └── weex</span></span>
<span class="line"><span>|  ├── server</span></span>
<span class="line"><span>|  |  ├── bundle-renderer</span></span>
<span class="line"><span>|  |  ├── optimizing-compiler</span></span>
<span class="line"><span>|  |  ├── template-renderer</span></span>
<span class="line"><span>|  |  └── webpack-plugin</span></span>
<span class="line"><span>|  ├── sfc</span></span>
<span class="line"><span>|  └── shared</span></span>
<span class="line"><span>└── test</span></span></code></pre></div><h2 id="入口在哪里" tabindex="-1">入口在哪里 <a class="header-anchor" href="#入口在哪里" aria-label="Permalink to &quot;入口在哪里&quot;">​</a></h2><p>自前端工程化以来，随着npm和yarn这样的包管理工具的应用，一切都变得可配置起来。而packag.json作为npm主要配置文件，其中有关于当前工程的一切配置信息。当然，我们阅读源码的时候其实更关注的是其中的&quot;scripts&quot;字段下配置的命令。</p><p>我们先看的“dev”命令。Vue源码并不是像我们的普通项目一样直接跑起来，而是运行了一个rollup工具，对源码进行打包, rollup后面跟的短字符都是它的命令行选项。事实上当我们运行<code>npm run dev</code>的时候，后边的内容是交给node执行的。</p><p><code>-w </code> 表示对源文件进行监听，当文件改变时重新打包；</p><p><code>-c</code> 表示rollup使用配置文件，其配置文件的路径是scripts/config.js。</p><p><code>--environment</code>是对环境变量的配置。在开发中，我们一般需要针对生产环境和开发环境使用不同的配置文件，如：prod.config.js、dev.config.js，但是开发环境和生产环境一般只有很少的一部分配置不同，因此无谓配置两个文件。这时候就可以直接通过<code>--environment</code>选项来配置一些环境变量，其后面更的是键值对，使用‘：’分隔。比如上面的配置是<code>--environment TARGET:web-full-dev</code>，此时访问<code>process.env.TARGET</code>的值就会是web-full-dev。</p><p>最后的<code>--sourcemap</code>表示生成sourcemap文件。</p><p>跟随配置文件的路径scripts/config.js，我们发现其核心代码是一个genConfig()方法，它生成了rollup打包所需的config配置对象。唯一特别的是，根据上面脚本命令配置的环境变量的不同，会生成不同的打包配置。当然，我们现在主要看的是“dev”命令的配置。当然，这个函数最终返回的对象需要结合代码的执行上下文查看，值得注意的是，在“dev”命令中，配置的入口路径指向：<code>src/platforms/web/entry-runtime-with-compiler.js</code>, 所以我们的源码就从这里开始看。</p><p>代码1： config.js文件中的genConfig方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function genConfig (name) {</span></span>
<span class="line"><span>  const opts = builds[name]</span></span>
<span class="line"><span>  const config = {</span></span>
<span class="line"><span>    input: opts.entry,</span></span>
<span class="line"><span>    external: opts.external,</span></span>
<span class="line"><span>    plugins: [</span></span>
<span class="line"><span>      flow(),</span></span>
<span class="line"><span>      alias(Object.assign({}, aliases, opts.alias))</span></span>
<span class="line"><span>    ].concat(opts.plugins || []),</span></span>
<span class="line"><span>    output: {</span></span>
<span class="line"><span>      file: opts.dest,</span></span>
<span class="line"><span>      format: opts.format,</span></span>
<span class="line"><span>      banner: opts.banner,</span></span>
<span class="line"><span>      name: opts.moduleName || &#39;Vue&#39;</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    onwarn: (msg, warn) =&gt; {</span></span>
<span class="line"><span>      if (!/Circular/.test(msg)) {</span></span>
<span class="line"><span>        warn(msg)</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // built-in vars</span></span>
<span class="line"><span>  const vars = {</span></span>
<span class="line"><span>    __WEEX__: !!opts.weex,</span></span>
<span class="line"><span>    __WEEX_VERSION__: weexVersion,</span></span>
<span class="line"><span>    __VERSION__: version</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // feature flags</span></span>
<span class="line"><span>  Object.keys(featureFlags).forEach(key =&gt; {</span></span>
<span class="line"><span>    vars[\`process.env.\${key}\`] = featureFlags[key]</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span>  // build-specific env</span></span>
<span class="line"><span>  if (opts.env) {</span></span>
<span class="line"><span>    vars[&#39;process.env.NODE_ENV&#39;] = JSON.stringify(opts.env)</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  config.plugins.push(replace(vars))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (opts.transpile !== false) {</span></span>
<span class="line"><span>    config.plugins.push(buble())</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Object.defineProperty(config, &#39;_name&#39;, {</span></span>
<span class="line"><span>    enumerable: false,</span></span>
<span class="line"><span>    value: name</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return config</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="我们该如何调试源码" tabindex="-1">我们该如何调试源码 <a class="header-anchor" href="#我们该如何调试源码" aria-label="Permalink to &quot;我们该如何调试源码&quot;">​</a></h2><p><a href="https://saikikoko.github.io/2020/08/07/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E5%A6%82%E4%BD%95%E8%B0%83%E8%AF%95Vue%E6%BA%90%E7%A0%81/" target="_blank" rel="noreferrer">https://saikikoko.github.io/2020/08/07/手把手教你如何调试Vue源码/</a></p><h2 id="vue到底是什么东西" tabindex="-1">Vue到底是什么东西 <a class="header-anchor" href="#vue到底是什么东西" aria-label="Permalink to &quot;Vue到底是什么东西&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Vue.prototype = {</span></span>
<span class="line"><span>    $mount: function() { ... },</span></span>
<span class="line"><span>   </span></span>
<span class="line"><span>    _init: function() { ... },</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    $data: {},</span></span>
<span class="line"><span>    $props: {},</span></span>
<span class="line"><span>    $set: function() { ... },</span></span>
<span class="line"><span>    $delete: function() { ... },</span></span>
<span class="line"><span>    $watch: function() { ... }，</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    $on: function() { ... },</span></span>
<span class="line"><span>    $once: function() { ... },</span></span>
<span class="line"><span>    $off: function() { ... },</span></span>
<span class="line"><span>    $emit: function() { ... },</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    _update: function() { ... },</span></span>
<span class="line"><span>    $forceUpdate: function() { ... },,</span></span>
<span class="line"><span>    $destory: function() { ... },</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    $nextTick: function() { ... },</span></span>
<span class="line"><span>    _render: function() { ... },</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>}</span></span></code></pre></div>`,17)]))}const h=s(l,[["render",i]]);export{f as __pageData,h as default};
