# 与Vue2的区别

在学习Vue3之前，我们先对vue2和vue3的不同之处做个比较。

- 修改底层响应式的实现方式。
- 添加组合式API的书写风格。
- 添加了响应式对象的创建方式
- 添加了组合式API的语法
- 通过`组合式函数`复用逻辑
- 修改了生命周期钩子

## 修改底层实现响应式的方式

在Vue2中响应式是通过`Object.defineProperty()`来实现的。通过遍历data对象上的每一个属性，并使用`Object.defineProperty()`给每个属性添加`getter`和`setter`，这样当数据发生变化的时候，`setter`会被触发，从而通知Vue进行dom更新。

而Vue3中，因为ES6原生支持使用`proxy`为对象添加代理，所以vue3选择使用了`proxy`来实现响应式，但是由于`proxy`不能直接用于原始类型，所以Vue3同时使用了`getter/setter`来支持原始类型的响应。更具体的体现在了Vue中的`reactive()`和`ref()`两个方法上。

这样做的好处是：在Vue2中，无法检测对象属性的添加和移除，必须通过`Vue.set()`添加可响应的对象; 它也无法检测到数组的变化，为此，Vue2重写了所侦听数组的`push()`、`pop()`、`splice()`等方法。
而Vue3中，这些问题就不存在了，我们只需要在响应式对象上直接添加属性即可。

## 添加组合式API的书写风格  

在Vue2中，我们会使用选项式API来编写Vue组件。在Vue3中，除了兼容了选项式API的书写风格，同时，我们也可以使用组合式API来编写Vue组件。实际上，选项是API是在组合式API的基础上实现的。

要开启组合式API，有两种方式：
- 添加`setup()`钩子。通常只在非单文件组件中，或者是在选项式API中集成使用。
```html
<template>
    <div>{{ count }}</div>
    <button @click="increment">+1</button>
</template>
<script>
    import { ref } from 'vue'
    export default {
        setup() {
            const count = ref(0);
            const increment = () => {
                count.value++;
            }
            // 必须从这里把状态和方法暴露出去
            return {
                count,
                increment
            }   
        }
    }
</script>
```
- 添加`<script setup>`标签。在`setup`函数中手动暴露状态和方法是很麻烦的，因此我们可以直接使用`<script setup>`来简化代码。
```html
<template>
    <div>{{ count }}</div>
    <button @click="increment">+1</button>
</template>
<script setup>
    import { ref } from 'vue'
    const count = ref(0);
    const increment = () => {
        count.value++;       
    }
</script>
```

## 添加了响应式对象的创建方式
在选项式API中，我们通过`data()`来创建响应式对象，也就是所有的可响应对象都必须定义在`data()`函数的`return`对象中。而在组合式API中，我们可以通过其他方式来创建响应式对象。
- ref()
  
```html
<template>
    <div>{{ state.count }}</div>
    <button @click="increment">+1</button>
</template>
<script setup>
    import { ref } from 'vue'
    const count = ref(0);
    const increment = () => {
        count.value++;
    }
</script>
```
- reactive()
```html
<template>
    <div>{{ state.count }}</div>
    <button @click="increment">+1</button>
</template>
<script setup>
    import { reactive } from 'vue'
    const state = reactive({
        count: 0
    });
    const increment = () => {
        state.count++;
    }
</script>
```
- shallowRef()

- shallowReactive()




- toRefs()
- toRef()
- toRaw()
- markRaw()
- customRef()
- provide()
- inject()
- readonly()
- isRef()
- isReactive()  
- isReadonly()  
- isProxy()


## 添加了组合式API的语法
- defineProps
- defineEmits
- computed
- watch

## 修改了生命周期钩子

 