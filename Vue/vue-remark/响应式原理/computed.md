> computed在initState函数中初始化，在文件`instance/state.js`中。

```javascript
export function initState (vm: Component) {
  xxx
  if (opts.computed) initComputed(vm, opts.computed)
  xxx
}
```

> initComputed定义在本文件中。

```javascript
function initComputed (vm: Component, computed: Object) {
    // 定义vm._computedWatchers，在computedGetter中被用来获取watchers进行求值
  const watchers = vm._computedWatchers = Object.create(null)
  const isSSR = isServerRendering() // 不重要

  for (const key in computed) {
    const userDef = computed[key] // 定义的computed属性
    // 如果传入的是一个对象则获取.get属性，这里是computed的用法不做详细讨论
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    // 这里是针对ssr的优化
    if (!isSSR) {
      // create internal watcher for the computed property.
      // 创建计算属性对应的watcher
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop, // 
        computedWatcherOptions // { lazy: true }
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
      
    // component的defineComputed在extend中被执行过，这里不会执行
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
```

> 针对computed的watcher暂时先不看，先看一下defineComputed，它定义在本文件中。

```javascript
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
    // 这里也是针对ssr的优化，因为ssr的计算属性是不需要watcher的直接求值即可。
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key) // 这里针对watcher进行求值，会收集依赖
      : createGetterInvoker(userDef) // 这个函数就是单纯的调用定义的函数，求值操作
    sharedPropertyDefinition.set = noop
  } else {
      // 针对用户自定义computed进行兼容处理，和上面的没什么区别
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
    // 劫持get, set，主要是get，在computed被用到的时候会被调用
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

> defineComputed执行完毕之后就是等待调用了，也就是执行get，也就是执行createComputedGetter，定义在本文件。

```javascript
function createComputedGetter (key) {
    // 类似于工厂的概念，返回computed的get
  return function computedGetter () {
      // _computedWatchers在这里被用到，它保存当前vue实例下所有的computedWatcher，这里获取key对应的watcher
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
        // dirty 脏值检查，有改变才计算 否则不计算
      if (watcher.dirty) {
        watcher.evaluate()
      }
        // Dep.target相当于父watcher
      if (Dep.target) {
        watcher.depend()
      }
        // 返回计算完毕的值
      return watcher.value
    }
  }
}
```

> 这里会先进行计算watcher.evaluate，那么接下来看看之前跳过的new Watcher。