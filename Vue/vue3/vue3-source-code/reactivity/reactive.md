文件定义在`packages/reactivity/src/reactive.ts`

# reactive

使用下面这个demo

```js
reactive({
  a: 1
})
```

先来看reactive的类型定义

```js
export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
```

使用的是泛型，参数只能object，返回的类型是UnwrapNestedRefs。

再来看看具体实现

```js
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (target && (target as Target)[ReactiveFlags.IS_READONLY]) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers
  )
}
```

```js
if (target && (target as Target)[ReactiveFlags.IS_READONLY]) {
  return target
}
```

首先是判断，如果target是readonly类型的proxy则直接返回

## createReactiveObject

```js
if (!isObject(target)) {
  if (__DEV__) {
    console.warn(`value cannot be made reactive: ${String(target)}`)
  }
  return target
}
```

不是object即报错返回

```js
// target is already a Proxy, return it.
// exception: calling readonly() on a reactive object
if (
  target[ReactiveFlags.RAW] &&
  !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
) {
  return target
}
```

这里的判断为false，因为`{a: 1}`是一个普通的对象，没有`__v_raw`属性。

```js
// target already has corresponding Proxy
const proxyMap = isReadonly ? readonlyMap : reactiveMap // reactiveMap
const existingProxy = proxyMap.get(target)
if (existingProxy) {
  return existingProxy
}

// reactiveMap readonlyMap
export const reactiveMap = new WeakMap<Target, any>()
export const readonlyMap = new WeakMap<Target, any>()
```

返回重复定义的响应式对象

```js
// only a whitelist of value types can be observed.
const targetType = getTargetType(target)
if (targetType === TargetType.INVALID) {
  return target
}

// TargetType
const enum TargetType {
  INVALID = 0,
  COMMON = 1,
  COLLECTION = 2
}
```

根据target的type，如果是无效的类型直接返回target

### getTargetType

```js
function getTargetType(value: Target) {
  return value[ReactiveFlags.SKIP] || !Object.isExtensible(value)
    ? TargetType.INVALID
    : targetTypeMap(toRawType(value))
}
```

带有ReactiveFlags.SKIP标识的对象或不可扩展的对象会返回`TargetType.INVALID`，否则判断数据类型

### targetTypeMap

```js
function targetTypeMap(rawType: string) {
  switch (rawType) {
    case 'Object':
    case 'Array':
      return TargetType.COMMON
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return TargetType.COLLECTION
    default:
      return TargetType.INVALID
  }
}
```

只能是`Object|Array|Map|Set|WeakMap|WeakSet`，其他类型返回`TargetType.INVALID`

```js
const proxy = new Proxy(
  target,
  targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
)
proxyMap.set(target, proxy)
return proxy
```

创建proxy，根据不同类型使用collectionHandlers或者baseHandlers

## 总结

1. reactive这些内容很简单，就是创建一个Proxy对象。关于Vue的内容暂时先不讲，可以看collectionHandlers和baseHandlers的实现
2. Vue3的目录结构更加扁平化，功能模块以独立的包的模式进行开发和使用，对于reactive我们完全可以拿出来单独使用，把对应的Proxy函数换掉即可

