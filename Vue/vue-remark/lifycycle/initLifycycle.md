> 生命周期初始化在`instance/init.js`中。

```javascript
initLifecycle(vm)
```

> 该方法用于初始化`Vue`的生命周期，定义在`instance/lifecycle.js`。

```javascript
const options = vm.$options

// locate first non-abstract parent
let parent = options.parent
if (parent && !options.abstract) {
  while (parent.$options.abstract && parent.$parent) {
    parent = parent.$parent
  }
  parent.$children.push(vm)
}

vm.$parent = parent
vm.$root = parent ? parent.$root : vm

vm.$children = []
vm.$refs = {}

vm._watcher = null
vm._inactive = null
vm._directInactive = false
vm._isMounted = false
vm._isDestroyed = false
vm._isBeingDestroyed = false
```

> 这段代码是对`vm`赋值初始化变量，没有什么特殊的地方，我们重点看看最下面定义的`callHook`函数。

```javascript
// #7573 disable dep collection when invoking lifecycle hooks
pushTarget()
const handlers = vm.$options[hook]
const info = `${hook} hook`
if (handlers) {
  for (let i = 0, j = handlers.length; i < j; i++) {
    invokeWithErrorHandling(handlers[i], vm, null, vm, info)
  }
}
if (vm._hasHookEvent) {
  vm.$emit('hook:' + hook)
}
popTarget()
```

> `pushTarget`和`popTarget`暂时不看，`vm.$options[hook]`是在`mergeOptions`的时候合并的。`invokeWithErrorHandling`是对钩子函数包一个错误捕捉函数，下面的判断先跳过。