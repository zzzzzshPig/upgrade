文件定义在`packages/reactivity/src/reactive.ts`

# 作用

只为某个对象的自有（第一层）属性创建浅层的**只读**响应式代理，同样也不会做深层次、递归地代理，深层次的属性并不是只读的

# demo

```js
shallowReadonly({
	a: 1
})
```

# 类型

```js
export function shallowReadonly<T extends object>(
  target: T
): Readonly<{ [K in keyof T]: UnwrapNestedRefs<T[K]> }>
```

传入一个`object`，返回`Readonly<{ [K in keyof T]: UnwrapNestedRefs<T[K]> }>`

# 实现

```js
export function shallowReadonly<T extends object>(
  target: T
): Readonly<{ [K in keyof T]: UnwrapNestedRefs<T[K]> }> {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    readonlyCollectionHandlers
  )
}
```

## createReactiveObject

和shallowReactive的区别在于shallowReadonlyHandlers，readonlyCollectionHandlers这两个参数不一样

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

collectionHandlers和baseHandlers相比于shallowReactive是不一样的

# 总结

1. 在方法的具体实现上和shallowReactive类似，最大的区别还是在Vue对于shallowReadonly的使用

