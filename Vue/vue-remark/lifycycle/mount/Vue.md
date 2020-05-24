> mount分为beforeMount和mounted。

### beforeMount

```javascript
if (vm.$options.el) {
  vm.$mount(vm.$options.el)
}
```

> 这里我们要注意的是组件是没有el的，所以很明显组件不会走这一步。$mount实际上是调用mountComponent，它被定义在`instance/lifeCycle.js`中。

```javascript
vm.$el = el
if (!vm.$options.render) {
  xxx
}
callHook(vm, 'beforeMount')
```

> 在mountComponent函数调用一开始就执行了beforeMount。



### mounted

> 在mountComponent函数的最后一段代码中。

```javascript
if (vm.$vnode == null) {
  vm._isMounted = true
  callHook(vm, 'mounted')
}
return vm
```

> 这里有一个判断我们要注意一下，vm.$vnode代表的是父级vnode不存在，也就是说明这个vm是root vnode，也就是说只会在new Vue的时候被调用，组件是不会调用的。