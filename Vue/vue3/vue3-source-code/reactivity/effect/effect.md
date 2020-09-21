在computed中略微提到过effect，不过跳过了没讲，今天就来探索effect的神奇之处

定义在`packages/reactivity/src/effect.ts`

# 类型

```js
export function effect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions = EMPTY_OBJ
): ReactiveEffect<T>
```

可以指定fn的返回值类型，fn为回调函数

```js
export interface ReactiveEffectOptions {
  lazy?: boolean
  scheduler?: (job: ReactiveEffect) => void
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
  onStop?: () => void
}
```

options是effect的配置项

```js
export interface ReactiveEffect<T = any> {
  (): T
  _isEffect: true
  id: number
  active: boolean
  raw: () => T
  deps: Array<Dep>
  options: ReactiveEffectOptions
}
```

ReactiveEffect返回一个具有以上属性的对象，raw和fn类似

# 实现

```js
export function effect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions = EMPTY_OBJ
): ReactiveEffect<T> {
  if (isEffect(fn)) {
    fn = fn.raw
  }
  const effect = createReactiveEffect(fn, options)
  if (!options.lazy) {
    effect()
  }
  return effect
}
```

```js
if (isEffect(fn)) {
  fn = fn.raw
}
```

对于传入的函数是effect，则取raw

```js
const effect = createReactiveEffect(fn, options)
```

## createReactiveEffect-start

```js
function createReactiveEffect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions
): ReactiveEffect<T> {
  const effect = function reactiveEffect(): unknown {
    if (!effect.active) {
      return options.scheduler ? undefined : fn()
    }
    if (!effectStack.includes(effect)) {
      cleanup(effect)
      try {
        enableTracking()
        effectStack.push(effect)
        activeEffect = effect
        return fn()
      } finally {
        effectStack.pop()
        resetTracking()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  } as ReactiveEffect
  effect.id = uid++
  effect._isEffect = true
  effect.active = true
  effect.raw = fn
  effect.deps = []
  effect.options = options
  return effect
}
```

参数和effect一致，返回值也一样，这里应该也能用class来写，我们一步一步的看

```js
if (!effect.active) {
  return options.scheduler ? undefined : fn()
}
```

这里只有在调用了`stop`之后`effect.active`才会为`false`，一般是在组件被销毁之后触发，还有就是`watch`和`watchEffect`的返回函数会调用`stop`。`options.scheduler`目前没有发现为false的情况

```js
if (!effectStack.includes(effect)) {
  cleanup(effect)
  try {
    enableTracking()
    effectStack.push(effect)
    activeEffect = effect
    return fn()
  } finally {
    effectStack.pop()
    resetTracking()
    activeEffect = effectStack[effectStack.length - 1]
  }
}
```

这一块逻辑就是追踪依赖的核心，对于不在`effectStack`中的`effect`有如下情况

1. 还未被`track`
2. 已经被`track`过了

对于还未被`track`的情况，`cleanup`等于没执行，对于已经被`track`过的，`cleanup`就会把依赖中的`effect`删除，防止发生不正确的依赖关系

### cleanup-start

```js
function cleanup(effect: ReactiveEffect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
    deps.length = 0
  }
}
```

### cleanup-end

### enableTracking-start

```js
export function enableTracking() {
  trackStack.push(shouldTrack)
  shouldTrack = true
}
```

`trackStack`是为了确保一连串track的状态，shouldTrack表示当前执行栈需要被追踪依赖

### enableTracking-end

```js
effectStack.push(effect)
activeEffect = effect
return fn()
```

`effectStack`是为了保留一连串`track`的`effect`，`activeEffect`是表示当前正在执行的`effect`，最后执行`fn`收集依赖

```js
finally {
  effectStack.pop()
  resetTracking()
  activeEffect = effectStack[effectStack.length - 1]
}
```

fn有可能调用出错，不论结果如何，都必须保证当前的栈正确，所以需要try和finally。

`effectStack.pop()`，当前的track已经执行完毕，从栈中删除

### resetTracking-start

```js
export function resetTracking() {
  const last = trackStack.pop()
  shouldTrack = last === undefined ? true : last
}
```

`trackStack.pop()`执行完毕之后，移除当前的track状态。`shouldTrack = last === undefined ? true : last`，这样写是因为当`trackStack.length === 0`的时候，`pop`操作会返回`undefined`，所以需要重置`shouldTrack`的值为`true`，否则沿用之前的状态

```js
let shouldTrack = true // 初始值
```

### resetTracking-end

```js
activeEffect = effectStack[effectStack.length - 1]
```

当前effect执行完毕出栈之后，`activeEffect`变为上一个入栈元素

```js
effect.id = uid++
effect._isEffect = true
effect.active = true
effect.raw = fn
effect.deps = []
effect.options = options
return effect
```

这些是一些初始化操作了，一眼就能看明白不讲了，最后返回effect函数

## createReactiveEffect-end

```js
if (!options.lazy) {
  effect()
}
return effect
```

最后如果`options.lazy`为false，即立即调用effect收集依赖，一般情况下lazy为true，只有在用到的时候才会追踪依赖

