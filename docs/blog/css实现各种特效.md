### css实现闪烁效果

``` css
.fa-star {
  color: yellow;
  font-size: 24px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```

上面的 CSS 代码将会让 .fa-star 的元素闪烁。animation: blink 1s infinite; 意味着我们正在应用名为 blink 的动画，以每秒一次的速度无限循环。

@keyframes blink 定义了闪烁的过程，具体地，它将使元素从完全透明到不透明再到回到完全透明。这个过程在整个动画时间内均匀分布。

您可以根据需要调整 animation 的持续时间、动画名称和属性，以达到您想要的效果。
