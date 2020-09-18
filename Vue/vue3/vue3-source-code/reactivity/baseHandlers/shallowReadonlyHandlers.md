定义在`packages/reactivity/src/baseHandlers.ts`

# 作用

做为`shallowReadonly`中`createReactiveObject`创建的`proxy`对象的handler

# 前言

这里只对比和readonlyHandlers的区别，具体的可以查看readonlyHandlers.md

# 类型

```js
export const shallowReadonlyHandlers: ProxyHandler<object>
```

类型是Proxy的第二个参数的类型

# 实现

```js
export const shallowReadonlyHandlers: ProxyHandler<object> = extend(
  {},
  readonlyHandlers,
  {
    get: shallowReadonlyGet
  }
)
```

使用extend继承自readonlyHandlers，实际上是

```js
{
	get: shallowReadonlyGet,
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
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true)
```

### createGetter

```js
if (shallow) {
  return res
}

if (isRef(res)) {
  // ref unwrapping - does not apply for Array + integer key.
  const shouldUnwrap = !targetIsArray || !isIntegerKey(key)
  return shouldUnwrap ? res.value : res
}

if (isObject(res)) {
  // Convert returned value into a proxy as well. we do the isObject check
  // here to avoid invalid value warning. Also need to lazy access readonly
  // and reactive here to avoid circular dependency.
  return isReadonly ? readonly(res) : reactive(res)
}
```

在这里直接将res进行返回，意思是不自动解构ref，也不进行子对象的代理，符合shallow的特性

> 只为某个对象的私有（第一层）属性创建浅层的响应式代理，不会对“属性的属性”做深层次、递归地响应式代理，而只是保留原样。



## set

继承自readonlyHandlers



## deleteProperty

继承自readonlyHandlers
