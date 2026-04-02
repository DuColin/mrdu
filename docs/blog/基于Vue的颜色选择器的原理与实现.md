# 基于Vue的颜色选择器的原理与实现

## 颜色的几大要素

- 色调。
- 饱和度。
- 亮度。
- 透明度。

## 颜色的几种格式
- hsl

  

- hsv

- rgb

- hex

## 渐变色相关操作

参考[less](https://github.com/less/less.js)的`mix`函数

```javascript
getGradientColor(color1, color2, weight) {
    const w1 = weight;
    const w2 = 1 - w1;
    const rgb = {
        r: Math.round(color1.r * w1 + color2.r * w2),
        g: Math.round(color1.g * w1 + color2.g * w2),
        b: Math.round(color1.b * w1 + color2.b * w2),
    };

    return rgb;
},
```

https://www.codeusage.com/article/zgR7QdOwoGDVxdyJ.html

## 参考资料
[1]: https://blog.csdn.net/mate_ge/article/details/87563567  "Vue自定义组件：颜色选择器及其实现原理"

[2]: https://github.com/ElemeFE/element "Element UI组件源码"
[3]: https://blog.csdn.net/qq_41260655/article/details/116032318

[4]: https://www.zhihu.com/question/22077462
[5]: https://juejin.cn/post/6844903908339351560
[6]: https://gka.github.io/chroma.js/#color-rgba
[7]: https://www.npmjs.com/package/vue-color-gradient-picker#examples

