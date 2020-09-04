文件定义在`packages/reactivity/src/reactive.ts`

# reactive

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

isReadonly为false所以后面的条件肯定是true，target[ReactiveFlags.RAW]限制target不能是

