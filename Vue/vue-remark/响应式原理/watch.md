> 本节demo

```javascript
{
  name: 'App',
  data () {
    return {
      firstName: 'first',
      lastName: 'last',
      name: 'first last',
      tp: {
        first: {
          tris: 0
        }
      }
    }
  },
  watch: {
    firstName () {
      console.log(this.firstName)
      this.name = this.firstName + this.lastName
    },
    lastName: {
      deep: true,
      handler () {
        console.log(this.lastName)
        this.name = this.firstName + this.lastName
      }
    },
    name: 'watchName',
    'tp.first' () {
      console.log(this.tp.first.tris)
    }
  },
  methods: {
    watchName () {
      console.log(this.name)
    },
    changeFirstName () {
      this.firstName = '123'
      this.lastName = Math.random()
    }
  }
}
```

> watch在initState函数中初始化，在文件`instance/state.js`中。

```javascript
export function initState (vm: Component) {
  xxxx
  // Firefox has a "watch" function on Object.prototype...
  // nativeWatch = ({}).watch
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

> initWatch定义在本文件中。

```javascript
function initWatch (vm: Component, watch: Object) {
    // 以 firstName 为例
  for (const key in watch) {
      // function
    const handler = watch[key]
    // 如果是数组，则依次createWatcher数组中的所有元素，这里不走
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
        // vm = vue instance，key = firstName，handler = function
      createWatcher(vm, key, handler)
    }
  }
}
```

> 这里就是对watch不同的使用形式进行处理，看下createWatcher，定义在本文件中。

```javascript
function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
      // 像lastName的值会走这里
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
      // 像name的值会走这里
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
      // 创建watch expOrfn = firstName, handler = function, options = undefined
  return vm.$watch(expOrFn, handler, options)
}
```

> 对watch的值进行处理，然后调用$watch，定义在本文件中。

```javascript
Vue.prototype.$watch = function (
  expOrFn: string | Function,
  cb: any,
  options?: Object
): Function {
  const vm: Component = this
    // 不走这里 cb = function, 这里是对手动创建的watch进行处理
  if (isPlainObject(cb)) {
    return createWatcher(vm, expOrFn, cb, options)
  }
    // options = undefined，所以取{}
  options = options || {}
    // userWatcher
  options.user = true
    // 创建watcher，核心部分
  const watcher = new Watcher(vm, expOrFn, cb, options)
  // 像lastName就会走这里
  if (options.immediate) {
    try {
        // 立即求值，watcher.value是watch的响应式对象的值
      cb.call(vm, watcher.value)
    } catch (error) {
      handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
    }
  }
    // 返回一个取消watch的函数
  return function unwatchFn () {
    watcher.teardown()
  }
}
```

> 下面就是核心的Watcher部分了，定义在`observer/watcher.js`。

```javascript
constructor (
  vm: Component,
  expOrFn: string | Function,
  cb: Function,
  options?: ?Object,
  isRenderWatcher?: boolean
) {
  this.vm = vm
    // isUserWatcher 不走
  if (isRenderWatcher) {
    vm._watcher = this
  }
  vm._watchers.push(this)
  // options
  if (options) {
    this.deep = !!options.deep // false
    this.user = !!options.user // true
    this.lazy = !!options.lazy // false
    this.sync = !!options.sync // false
    this.before = options.before // undefined
  } else {
    this.deep = this.user = this.lazy = this.sync = false
  }
    // firstName的值 function
  this.cb = cb
  this.id = ++uid // uid for batching
  this.active = true
  this.dirty = this.lazy // for lazy watchers
  this.deps = []
  this.newDeps = []
  this.depIds = new Set()
  this.newDepIds = new Set()
  this.expression = process.env.NODE_ENV !== 'production'
    ? expOrFn.toString()
    : '' // firstName
  // parse expression for getter
    // 走else
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn
  } else {
      // 解析firstName 如果解析成功会返回一个函数做为getter
    this.getter = parsePath(expOrFn)
    if (!this.getter) {
      this.getter = noop
      process.env.NODE_ENV !== 'production' && warn(
        `Failed watching path: "${expOrFn}" ` +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      )
    }
  }
    // this.lazy为false 调用this.get()
  this.value = this.lazy
    ? undefined
    : this.get()
}
```

> 这里我们先看一下parsePath，定义在`util/lang.js`。

```javascript
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)
export function parsePath (path: string): any {
    // 检测firstName是否合法，这里合法
  if (bailRE.test(path)) {
    return
  }
    // 这里是['firstName']
  const segments = path.split('.')
  // 返回的这个function做为getter
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
```

> 返回的这个函数先不看，等下用到时候再看，接下来我们再看watcher最后的`this.get()`。

```javascript
get () {
    // userWatcher
  pushTarget(this)
  let value
  const vm = this.vm
  try {
      // value = 'first'
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
      // 像lastName会走这里
    if (this.deep) {
      traverse(value)
    }
    popTarget()
      // 更新deps
    this.cleanupDeps()
  }
  return value
}
```

> 这里有几个地方需要看，首先看`this.getter.call(vm, vm)`，这个就是之前调用parsePath返回的function。

```javascript
// segments = ['firstName']，obj = vm
return function (obj) {
    for (let i = 0; i < segments.length; i++) {
        if (!obj) return
        obj = obj[segments[i]]
    }
    // 如果path是'a.b.c'，那么segments = ['a', 'b', 'c'] 先取vm.a，再取a.b，再取b.c，这里会依次访问这三个属性，也就会依次触发响应式对象的get，从而收集依赖。
    // vm.firstName
    return obj
}
```

> 然后再看一下traverse，定义在`observer/traverse.js`。

```javascript
const seenObjects = new Set()

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
export function traverse (val: any) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}
```

> _traverse定义在本文件中。

```javascript
function _traverse (val: any, seen: SimpleSet) {
  let i, keys
  const isA = Array.isArray(val) // false
  // firstName会直接return, tp继续往下面走
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  // 这里是一个响应式对象
  if (val.__ob__) {
      // 收集depid，防止死循环
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
    // 递归遍历所有的值
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
```

> _traverse的作用是用来深度收集依赖的，他会递归的将一个对象下所有的value都获取一遍，会触发他们的get从而收集依赖，如果value是对象则递归，如果是数组则遍历递归。最后会收集到所有的dep。这是一个很消耗内存的和时间的操作，所以尽量避免使用deep，这也是为什么默认不会对watch的对象下面的子属性进行监听。_traverse的本质是递归触发所有get，为了防止死循环的发生使用了set进行dep.id的收集。

> 最后在监听的对象的值发生改变的时候会调用`dep.notify`从而调用`watcher.update`，然后会调用到`queueWatcher`，然后调用`run`，从而再次调用`this.get`，如果改变的值有效最后会触发`this.cb.call(this.vm, value, oldValue)`，调用firstName的value。

```javascript
firstName () {
  console.log(this.firstName)
  this.name = this.firstName + this.lastName
}
```
### 总结

1. watch实际上是创建userWatcher，区别于computed，它支持`deep,sync,immediate`等配置。
2. computed适合用在模板渲染中，而watch适合观察某个值的变化从而完成一段复杂的逻辑。

