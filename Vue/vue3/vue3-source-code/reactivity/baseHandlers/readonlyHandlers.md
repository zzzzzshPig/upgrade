定义在`packages/reactivity/src/baseHandlers.ts`

# 作用

做为`readonly`中`createReactiveObject`创建的`proxy`对象的handler

# 前言

这里只对比和mutableHandlers的区别，具体的可以查看mutableHandlers.md

# 类型

```js
export const readonlyHandlers: ProxyHandler<object>
```

类型是Proxy的第二个参数的类型

# 实现

```js
export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  set(target, key) {
    if (__DEV__) {
      console.warn(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
    }
    return true
  },
  deleteProperty(target, key) {
    if (__DEV__) {
      console.warn(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
    }
    return true
  }
}
```

## get

```js
const readonlyGet = /*#__PURE__*/ createGetter(true)
```

### createGetter

```js
if (!isReadonly) {
  track(target, TrackOpTypes.GET, key)
}
```

这里不会为对象添加响应式监听，因为不会被set，也就不需要响应式监听了

```js
if (isObject(res)) {
  // Convert returned value into a proxy as well. we do the isObject check
  // here to avoid invalid value warning. Also need to lazy access readonly
  // and reactive here to avoid circular dependency.
  return isReadonly ? readonly(res) : reactive(res)
}
```

对子对象进行代理，readonly就调用readonly函数即可



## set

```js
set(target, key) {
  if (__DEV__) {
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    )
  }
  return true
}
```

这里没有对target进行赋值，在dev环境下报警告



## deleteProperty

```js
deleteProperty(target, key) {
  if (__DEV__) {
    console.warn(
      `Delete operation on key "${String(key)}" failed: target is readonly.`,
      target
    )
  }
  return true
}
```

和set一样