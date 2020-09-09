文件定义在`packages/reactivity/src/reactive.ts`

# demo

```js
readonly({
	a: 1
})
```

# 类型定义

```js
export function readonly<T extends object>(
  target: T
): DeepReadonly<UnwrapNestedRefs<T>>
```

传入一个`object`，返回`DeepReadonly<UnwrapNestedRefs<T>>`

# 具体实现

```js
export function readonly<T extends object>(
  target: T
): DeepReadonly<UnwrapNestedRefs<T>> {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers
  )
}
```

## createReactiveObject

和reactive的区别在于isReadonly，baseHandlers，collectionHandlers这三个参数不一样，这里只看有影响的地方

```js
const proxyMap = isReadonly ? readonlyMap : reactiveMap
const existingProxy = proxyMap.get(target)
if (existingProxy) {
  return existingProxy
}
```

这里取readonlyMap来判断重复proxy

```js
const proxy = new Proxy(
  target,
  targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
)
proxyMap.set(target, proxy)
return proxy
```

collectionHandlers和baseHandlers相比于reactive是不一样的

# 总结

1. 在方法的具体实现上和reactive类似，最大的区别还是在Vue对于readonly的使用
