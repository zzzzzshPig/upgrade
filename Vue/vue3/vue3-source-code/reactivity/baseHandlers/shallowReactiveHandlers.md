定义在`packages/reactivity/src/baseHandlers.ts`

# 作用

做为`shallowReactive`中`createReactiveObject`创建的`proxy`对象的handler

# 前言

这里只对比和mutableHandlers的区别，具体的可以查看mutableHandlers.md

# 类型

```js
export const shallowReactiveHandlers: ProxyHandler<object>
```

类型是Proxy的第二个参数的类型

# 实现

```js
export const shallowReactiveHandlers: ProxyHandler<object> = extend(
  {},
  mutableHandlers,
  {
    get: shallowGet,
    set: shallowSet
  }
)
```

使用extend继承自mutableHandlers，实际上是

```js
{
	get: shallowGet,
  set: shallowSet,
	deleteProperty,
  has,
  ownKeys
}
```



## get

```js
const shallowGet = /*#__PURE__*/ createGetter(false, true)
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

```js
const shallowSet = /*#__PURE__*/ createSetter(true)
```

```js
if (!shallow) {
  value = toRaw(value)
  if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
    oldValue.value = value
    return true
  }
}
```

对于非shallow的代理才会对ref进行解构赋值，这里其实完全是可以的，但是shallow的本意就是只对第一层的对象进行代理，子对象保留原样，所以不进行解构也是合理的。



## deleteProperty

继承自mutableHandlers



## has

继承自mutableHandlers



## ownKeys

继承自mutableHandlers

