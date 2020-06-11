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

> 这里是定义computed的get和set的，set没有什么特殊的，来看看定义get的方法createComputedGetter，它定义在本文件。

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

> 这里主要是对watcher的调用，我们来看一下computed的watcher有什么特殊的，定义在`observer/watcher.js`。

```javascript
constructor (
  vm: Component,
  expOrFn: string | Function,
  cb: Function,
  options?: ?Object,
  isRenderWatcher?: boolean
) {
  xxx
  // options
  if (options) {
	xxx
    this.lazy = !!options.lazy // true
	xxx
  } else {
    xxx
  }
  xxx
  this.dirty = this.lazy // true
  xxx
  // 对于computed来说 expOrFn是function
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn
  } else {
    xxx
  }
  // 返回值是undefined
  this.value = this.lazy
    ? undefined
    : this.get()
}
```

> 上面这段代码只专注于computed相关的部分，其他的也会被调用但是属于watcher本身的特性。最后的返回值是undefined没有调用this.get，到这里就没有再执行什么了，等computed的get被调用后会执行computedGetter。

```javascript
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
```

> 首先执行的是watcher.evaluate()，它是用来计算这个watcher的值的。

```javascript
/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
evaluate () {
  this.value = this.get()
  // 求值之后把dirty设置为false 如果不进行修改则下次不会再求值
  this.dirty = false
}
```

> 这里调用了get进行求值，然后将dirty设置为false，看看this.get。

```javascript
get () {
    // 将dep.Target设置为computedWatcher
  pushTarget(this)
  let value
  const vm = this.vm
  try {
    // 调用expOrFn也就是用户定义的computed方法。
    value = this.getter.call(vm, vm)
  } catch (e) {
    if (this.user) {
      handleError(e, vm, `getter for watcher "${this.expression}"`)
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value)
    }
    popTarget()
    this.cleanupDeps()
  }
  return value
}
```

> 这里我们来个demo。

```javascript
{
	computed: {
		getName () {
			return this.firstName + this.lastName
		}
	}
}
```

> 上面调用的`this.getter.call(vm, vm)`，其实就是调用这个函数，在获取`this.firstName`的值的时候会走入它的get函数。

```javascript
get: function reactiveGetter () {
  const value = getter ? getter.call(obj) : val
  // computedWatcher
  if (Dep.target) {
    // 收集依赖 
    dep.depend()
    if (childOb) {
      childOb.dep.depend()
      if (Array.isArray(value)) {
        dependArray(value)
      }
    }
  }
  return value
}
```

> 执行了响应式对象的get之后，computed就会收集响应式对象的依赖。回到createComputedGetter。

```javascript
// 第一次调用的时候一般是renderWatcher，没有Dep.target的情况一般是没有在渲染中使用。
if (Dep.target) {
  watcher.depend()
}
```

> watcher.depend()是一个收集依赖的过程。这里和之前的this.firstName一致。

> 到这一步，computed计算出了它的值，也收集了它的依赖。如果依赖不变化则不会有什么变化。我们让this.firstName发生变化，那么就会调用它的set。

```javascript
set: function reactiveSetter (newVal) {
  xxx
  dep.notify()
}
```

> 其他内容和本节无关，最后会调用notify。

```javascript
notify () {
  xxx
  for (let i = 0, l = subs.length; i < l; i++) {
    subs[i].update()
  }
}
```

> 通知所有的watcher进行update，这里会通知getName的watcher。

```javascript
update () {
  /* istanbul ignore else */
  if (this.lazy) {
    // computedWatcher update 可以再次求值
    this.dirty = true
  } else if (this.sync) {
    this.run()
  } else {
    queueWatcher(this)
  }
}
```

> 这里this.lazy为true，更新dirty，随后进行下一个watcher的update，在本例中是renderWatcher，此时lazy为false，sync为false，会走queueWatcher然后进行重新渲染renderWatcher，在重新渲染的过程中又会用到getName的值，所以会调用它的get。所以又会调用computed方法获取this.fristName和this.lastName的值，以此来完成对数据的更新。

### 总结

1. computed的值在调用它get的时候才会获取，不调用get不会获取，是一个惰性加载。
2. 对于computed属性更多了还是对watcher的深度利用，相当于一个特殊的watcher。

