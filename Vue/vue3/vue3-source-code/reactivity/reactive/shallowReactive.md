文件定义在`packages/reactivity/src/reactive.ts`

# 作用

只为某个对象的私有（第一层）属性创建浅层的响应式代理，不会对“属性的属性”做深层次、递归地响应式代理，而只是保留原样

# demo

```js
shallowReactive({
	a: 1
})
```

# 类型定义

```js
export function shallowReactive<T extends object>(
  target: T
): T
```

传入一个`object`，返回`T`

# 具体实现

```js
export function shallowReactive<T extends object>(target: T): T {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers
  )
}
```

## createReactiveObject

和reactive的区别在于isReadonly，shallowReactiveHandlers，shallowCollectionHandlers这两个参数不一样

```js
const proxy = new Proxy(
  target,
  targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
)
proxyMap.set(target, proxy)
return proxy
```

# 总结

1. 在方法的具体实现上和reactive类似，最大的区别还是在Vue对于shallowReactive的使用

