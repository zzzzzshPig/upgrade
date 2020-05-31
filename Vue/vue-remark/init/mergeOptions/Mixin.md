> mixin的mergeOptions定义在`global-api/mixin.js`。

```javascript
Vue.mixin = function (mixin: Object) {
  this.options = mergeOptions(this.options, mixin)
  return this
}
```

> 这里实际上就是对Vue.options进行扩展，进入mergeOptions。

```javascript
if (!child._base) {
  if (child.extends) {
    parent = mergeOptions(parent, child.extends, vm)
  }
  if (child.mixins) {
    for (let i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm)
    }
  }
}
```

> 除了这一段代码之外其他的和new Vue，component的mergeOptions没什么区别。

> Vue.mixin实际上是相当于Vue全局配置的概念，在new Vue之前就被设置进去了，所以我们需要在new Vue()之前进行调用，否则只有等下一个new Vue了(: