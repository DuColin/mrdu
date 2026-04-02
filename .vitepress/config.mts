import { defineConfig, type DefaultTheme } from "vitepress";

export default defineConfig({
    title: "Colin Du's blog",
    description: "A VitePress Site",
    base: "/mrdu/",
    srcDir: 'docs',
    themeConfig: {
        nav: nav(),
        sidebar: {
            "/article/": sidebarArticle(),
            "/weixin/": sidebarWeixin(),
            "/note/base/": sidebarBase(),
            "/note/algorithm/": sidebarAlgorithm(),
            "/note/framework/": sidebarFramework(),
            "/note/engineering/": sidebarEngineering(),
            "/note/mobile": sidebarMobile(),
            "/note/server": sidebarServer(),
            "/note/optimize": sidebarOptimize(),
            "/note/secure": sidebarSecure(),
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
    },
});

function nav(): DefaultTheme.NavItem[] {
    return [
        {
            text: "文章",
            link: "/article/大型前端工程的管理方式",
            activeMatch: "/article",
        },
        {
            text: "笔记",
            items: [
                {
                    text: "基础",
                    link: "/note/base/typescript/快速上手",
                },
                {
                    text: "算法",
                    link: "/note/algorithm/树",
                },
                {
                    text: "框架",
                    link: "/note/framework/vue3/概述",
                },
                {
                    text: "工程化",
                    link: "/note/engineering/概述",
                },
                {
                    text: "移动端",
                    link: "/note/mobile/移动端开发技术路线",
                },
                {
                    text: "服务端",
                    link: "/note/server/node服务端开发",
                },
                {
                    text: "优化",
                    link: "/note/optimize/exception/如何处理异常",
                },
                {
                    text: "安全",
                    link: "/note/secure/非对称加密",
                },
            ],
        },
        {
            text: "微信生态",
            link: "/weixin/快速上手",
            activeMatch: "/weixin",
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
                    text: "使用node开发命令行工具",
                    link: "使用node开发命令行工具",
                },
                {
                    text: "大型前端工程的管理方式",
                    link: "大型前端工程的管理方式",
                },
                {
                    text: "单点登录",
                    link: "单点登录",
                },
                {
                    text: "浏览器的兼容性",
                    link: "浏览器的兼容性",
                },
                {
                    text: "如何做好国际化",
                    link: "如何做好国际化",
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
                { text: "快速上手", link: "快速上手" },
                { text: "微信扫码登录实现", link: "微信扫码登录实现" },
            ],
        },
        {
            text: "微信小程序",
            base: "/weixin/wxApp/",
            items: [
                { text: "快速上手", link: "快速上手" },
                { text: "路由", link: "路由" },
            ],
        }
    ];
}

function sidebarBase(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "TypeScript",
            base: "/note/base/typescript/",
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
            base: "/note/base/node/",
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
            base: "/note/base/npm/",
            collapsed: false,
            items: [{ text: "package.json详解", link: "package" }],
        },
        {
            text: "浏览器",
            base: "/note/base/browser/",
            collapsed: false,
            items: [
                { text: "跨域", link: "跨域" },
                { text: "浏览器中的存储", link: "浏览器中的存储" },
            ],
        },
        {
            text: "JavaScript",
            base: "/note/base/javascript/",
            collapsed: false,
            items: [{ text: "模块系统", link: "模块系统" }],
        },
        {
            text: "网络",
            base: "/note/base/network/",
            collapsed: false,
            items: [{ text: "http缓存机制", link: "http缓存机制" }],
        },
    ];
}

function sidebarAlgorithm(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "算法",
            base: "/note/algorithm/",
            items: [{ text: "树", link: "树" }],
        },
    ];
}

function sidebarFramework(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "Vue3",
            base: "/note/framework/vue3/",
            collapsed: false,
            items: [
                { text: "与vue2的区别", link: "与vue2的区别" },
                { text: "样式支持", link: "样式支持" },
            ],
        },
        {
            text: "React",
            base: "/note/framework/react/",
            collapsed: false,
            items: [
                { text: "快速上手", link: "快速上手" },
                { text: "组件", link: "组件" },
                { text: "jsx", link: "jsx" },
                { text: "hook", link: "hook" },
                { text: "hook的实现原理", link: "hook的实现原理" },
                { text: "组件间的通信", link: "组件间的通信" },
                { text: "css样式", link: "css样式" },
            ],
        },
        {
            text: "React路由",
            base: "/note/framework/react-router/",
            collapsed: false,
            items: [{ text: "快速上手", link: "快速上手" }],
        },
        {
            text: "Redux",
            base: "/note/framework/redux/",
            collapsed: false,
            items: [{ text: "快速上手", link: "快速上手" }],
        },
        {
            text: "electron",
            base: "/note/framework/electron/",
            collapsed: false,
            items: [{ text: "概述", link: "概述" }],
        },
        {
            text: "React Native",
            base: "/note/framework/react-native/",
            collapsed: false,
            items: [{ text: "开发环境", link: "开发环境" }],
        },
    ];
}

function sidebarEngineering(): DefaultTheme.SidebarItem[] {
    return [
        // {
        //     text: "工程化",
        //     base: "/note/engineering/",
        //     items: [{ text: "概述", link: "概述" }],
        // },
        // {
        //     text: "webpack",
        //     base: "/note/engineering/webpack/",
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
            base: "/note/engineering/vite/",
            collapsed: false,
            items: [{ text: "快速上手", link: "快速上手" }],
        },
        {
            text: "测试",
            base: "/note/engineering/test/",
            collapsed: false,
            items: [{ text: "概述", link: "概述" }],
        },
    ];
}

function sidebarMobile(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "移动端",
            base: "/note/mobile/",
            collapsed: false,
            items: [{ text: "移动端开发技术路线", link: "移动端开发技术路线" }],
        },
        {
            text: "uni app",
            base: "/note/mobile/uniapp/",
            collapsed: false,
            items: [{ text: "概述", link: "概述" }],
        },
    ];
}

function sidebarServer(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "服务端",
            base: "/note/server/",
            items: [{ text: "node服务端开发", link: "node服务端开发" }],
        },
    ];
}

function sidebarOptimize(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "异常",
            base: "/note/optimize/exception/",
            items: [{ text: "如何处理异常", link: "如何处理异常" }],
        },
        {
            text: "性能",
            base: "/note/optimize/performance/",
            items: [{ text: "如何评估性能", link: "如何评估性能" }],
        },
    ];
}

function sidebarSecure(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: "安全",
            base: "/note/secure/",
            items: [{ text: "非对称加密", link: "非对称加密" }],
        },
    ];
}
