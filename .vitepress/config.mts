import { defineConfig, type DefaultTheme } from "vitepress";
// import mathjax from 'markdown-it-mathjax3';

export default defineConfig({
    title: "Colin Du's blog",
    description: "A VitePress Site",
    base: "/mrdu/",
    srcDir: "docs",
    themeConfig: {
        nav: nav(),
        sidebar: {
            "/article/": sidebarArticle(),
            "/weixin/": sidebarWeixin(),
            "/frontend-base/": sidebarBase(),
            "/frontend-framework/": sidebarFramework(),
            "/frontend-engineering/": sidebarEngineering(),
            "/frontend-alg": sidebarAlg(),
            "/frontend/mobile": sidebarMobile(),
            "/frontend/server": sidebarServer(),
            "/frontend/optimize": sidebarOptimize(),
            "/frontend/secure": sidebarSecure(),
            "/ai-guide/": sidebarGuide(),
            "/business-plm": sidebarPLM(),
        },
        socialLinks: [
            { icon: "github", link: "https://github.com/MrDuCongcong/mrdu" },
        ],
        outline: {
            label: "页面导航",
            level: [2, 4],
        },
        lastUpdated: {
            text: "最后更新于",
            formatOptions: {
                dateStyle: "short",
                timeStyle: "medium",
            },
        },
        footer: {
            message: "基于 MIT 许可发布",
            copyright: `版权所有 © 2019-${new Date().getFullYear()} 杜聪聪`,
        },
    },
    markdown: {
        theme: {
            light: "github-light",
            dark: "github-dark",
        },
        // config: (md) => {
        //     md.use(mathjax);
        // },
    },
});

function nav(): DefaultTheme.NavItem[] {
    return [
        {
            text: "微信生态",
            link: "/weixin/生态简介",
            activeMatch: "/weixin",
        },
        {
            text: "前端",
            items: [
                {
                    text: "基础",
                    link: "/frontend-base/typescript/快速上手",
                },
                {
                    text: "框架",
                    link: "/frontend-framework/vue3/与vue2的区别",
                },
                {
                    text: "工程化和架构",
                    link: "/frontend-engineering/概述",
                },
                {
                    text: "算法",
                    link: "/frontend-alg/单向链表",
                },
                {
                    text: "移动端",
                    link: "/frontend/mobile/移动端开发技术路线",
                },
                {
                    text: "服务端",
                    link: "/frontend/server/node服务端开发",
                },
                {
                    text: "优化",
                    link: "/frontend/optimize/exception/如何处理异常",
                },
                {
                    text: "安全",
                    link: "/frontend/secure/非对称加密",
                },
            ],
        },
        {
            text: "AI",
            items: [
                {
                    text: "基础",
                    link: "/ai-guide/LLM",
                },
            ],
        },
        {
            text: "业务",
            items: [
                {
                    text: "PLM",
                    link: "/business-plm/plm/PLM",
                },
            ],
        },
    ];
}

function sidebarArticle(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "文章",
            base: "/article/",
            items: [
                {
                    text: "微前端",
                    link: "微前端",
                },
                {
                    text: "使用node开发命令行工具",
                    link: "使用node开发命令行工具",
                },
            ],
        },
    ];
}

function sidebarWeixin(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "微信生态",
            base: "/weixin/",
            items: [
                { text: "生态简介", link: "生态简介" },
                { text: "微信扫码登录实现", link: "微信扫码登录实现" },
            ],
        },
        {
            text: "微信小程序",
            base: "/weixin/wxApp/",
            items: [
                {
                    text: "简介",
                    link: "简介",
                },
                {
                    text: "运行容器",
                    items: [
                        {
                            text: "运行架构",
                            link: "运行架构",
                        },
                        {
                            text: "API",
                            link: "API",
                        },
                    ],
                },
                {
                    text: "技术体系",
                    items: [
                        {
                            text: "开发框架",
                            link: "开发框架",
                            items: [
                                { text: "基础", link: "基础" },
                                { text: "组件", link: "组件" },
                                { text: "页面", link: "页面" },
                                { text: "路由", link: "路由" },
                                { text: "生命周期", link: "生命周期" },
                            ],
                        },
                        {
                            text: "后端服务",
                            items: [],
                        },
                    ],
                },
                {
                    text: "运营与发布",
                    items: [],
                },
            ],
        },
    ];
}

function sidebarBase(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "TypeScript",
            base: "/frontend-base/typescript/",
            collapsed: false,
            items: [
                { text: "快速上手", link: "快速上手" },
                {
                    text: "语言",
                    items: [
                        { text: "类型系统", link: "类型系统" },
                        {
                            text: "类型运算与工具类型",
                            link: "类型运算与工具类型",
                        },
                        { text: "装饰器", link: "装饰器" },
                        { text: "语言思考", link: "语言思考" },
                    ],
                },
                {
                    text: "编译 & 配置",
                    items: [{ text: "tsconfig.json", link: "tsconfig" }],
                },
                {
                    text: "生态融合",
                    items: [
                        { text: "声明文件", link: "声明文件" },
                        { text: "js生态集成", link: "js生态集成" },
                    ],
                },
            ],
        },
        {
            text: "node",
            base: "/frontend-base/node/",
            collapsed: false,
            items: [
                { text: "进程模型", link: "进程模型" },
                { text: "process模块", link: "process模块" },
                { text: "os模块", link: "os模块" },
                { text: "fs模块", link: "fs模块" },
                { text: "path模块", link: "path模块" },
                { text: "stream模块", link: "stream模块" },
                { text: "events模块", link: "events模块" },
                { text: "子进程", link: "子进程" },
            ],
        },
        {
            text: "包管理器",
            base: "/frontend-base/npm/",
            collapsed: false,
            items: [{ text: "package.json详解", link: "package" }],
        },
        {
            text: "浏览器",
            base: "/frontend-base/browser/",
            collapsed: false,
            items: [
                { text: "浏览器中的存储", link: "浏览器中的存储" },
                { text: "shadow DOM", link: "shadowDOM" },
            ],
        },
        {
            text: "JavaScript",
            base: "/frontend-base/javascript/",
            collapsed: false,
            items: [{ text: "模块系统", link: "模块系统" }],
        },
        {
            text: "网络",
            base: "/frontend-base/network/",
            collapsed: false,
            items: [{ text: "http缓存机制", link: "http缓存机制" }],
        },
    ];
}

function sidebarFramework(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "Vue3",
            base: "/frontend-framework/vue3/",
            collapsed: false,
            items: [
                {
                    text: "框架上手",
                    items: [
                        { text: "与vue2的区别", link: "与vue2的区别" },
                        { text: "样式支持", link: "样式支持" },
                    ],
                },
                {
                    text: "核心原理",
                    items: [{ text: "渲染过程", link: "渲染过程" }],
                },
            ],
        },
        {
            text: "React",
            base: "/frontend-framework/react/",
            collapsed: false,
            items: [
                {
                    text: "框架上手",
                    items: [
                        { text: "快速上手", link: "快速上手" },
                        { text: "组件", link: "组件" },
                        { text: "jsx", link: "jsx" },
                        { text: "hooks", link: "hooks" },
                        { text: "组件间的通信", link: "组件间的通信" },
                        { text: "css样式", link: "css样式" },
                    ],
                },
                {
                    text: "核心原理",
                    items: [
                        { text: "Fiber架构", link: "Fiber架构" },
                        { text: "状态更新过程", link: "状态更新过程" },
                        { text: "hook原理", link: "hook原理" },
                    ],
                },
            ],
        },
        {
            text: "React路由",
            base: "/frontend-framework/react-router/",
            collapsed: false,
            items: [{ text: "快速上手", link: "快速上手" }],
        },
        {
            text: "Redux",
            base: "/frontend-framework/redux/",
            collapsed: false,
            items: [{ text: "快速上手", link: "快速上手" }],
        },
        {
            text: "electron",
            base: "/frontend-framework/electron/",
            collapsed: false,
            items: [{ text: "概述", link: "概述" }],
        },
        {
            text: "React Native",
            base: "/frontend-framework/react-native/",
            collapsed: false,
            items: [{ text: "开发环境", link: "开发环境" }],
        },
    ];
}

function sidebarEngineering(): DefaultTheme.SidebarItem[] {
    return [
        // {
        //     text: "工程化",
        //     base: "/frontend-engineering/",
        //     items: [{ text: "概述", link: "概述" }],
        // },
        // {
        //     text: "webpack",
        //     base: "/frontend-engineering/webpack/",
        //     collapsed: false,
        //     items: [
        //         {
        //             text: "devServer是如何运行的",
        //             link: "devServer是如何运行的",
        //         },
        //     ],
        // },
        {
            text: "vite",
            base: "/frontend-engineering/vite/",
            collapsed: false,
            items: [{ text: "快速上手", link: "快速上手" }],
        },
        {
            text: "架构",
            base: "/frontend-engineering/architecture/",
            collapsed: false,
            items: [{ text: "微前端", link: "微前端" }],
        },
    ];
}

function sidebarAlg(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "算法",
            base: "/frontend-alg/",
            collapsed: false,
            items: [
                { text: "单向链表", link: "单向链表" }
            ],
        },
    ];
}

function sidebarMobile(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "移动端",
            base: "/frontend/mobile/",
            collapsed: false,
            items: [{ text: "移动端开发技术路线", link: "移动端开发技术路线" }],
        },
        {
            text: "uni app",
            base: "/frontend/mobile/uniapp/",
            collapsed: false,
            items: [{ text: "概述", link: "概述" }],
        },
    ];
}

function sidebarServer(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "服务端",
            base: "/frontend/server/",
            items: [{ text: "node服务端开发", link: "node服务端开发" }],
        },
    ];
}

function sidebarOptimize(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "异常",
            base: "/frontend/optimize/exception/",
            items: [{ text: "如何处理异常", link: "如何处理异常" }],
        },
        {
            text: "性能",
            base: "/frontend/optimize/performance/",
            items: [{ text: "如何评估性能", link: "如何评估性能" }],
        },
    ];
}

function sidebarSecure(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "安全",
            base: "/frontend/secure/",
            items: [{ text: "非对称加密", link: "非对称加密" }],
        },
    ];
}

function sidebarPLM(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "PLM",
            base: "/business-plm/plm/",
            items: [
                {
                    text: "PLM",
                    link: "PLM",
                },
            ],
        },
        {
            text: "项目管理",
            base: "/business-plm/manage/",
            items: [
                {
                    text: "项目管理",
                    link: "PLM项目管理",
                },
            ],
        },
    ];
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "基本概念",
            items: [
                {
                    text: "大语言模型",
                    link: "/ai-guide/LLM",
                },
                {
                    text: "Agent",
                    link: "/ai-guide/Agent",
                },
                {
                    text: "token",
                    link: "/ai-guide/token",
                },
                {
                    text: "skill",
                    link: "/ai-guide/skill",
                },
                {
                    text: "MCP",
                    link: "/ai-guide/MCP",
                },
            ],
        },
    ];
}
