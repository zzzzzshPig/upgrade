文件定义在`packages/reactivity/src/reactive.ts`

# 作用

显式标记一个对象为“永远不会转为响应式代理”，函数返回这个对象本身。

# 类型定义

```js
export function markRaw<T extends object>(value: T): T
```

传入`object`，返回`object`

# 具体实现

```js
export function markRaw<T extends object>(value: T): T {
  def(value, ReactiveFlags.SKIP, true)
  return value
}
```

## def

```js
export const def = (obj: object, key: string | symbol, value: any) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  })
}
```

设置`value[ReactiveFlags.SKIP]`属性值为true，并且不可被枚举，`ReactiveFlags.SKIP`属性设置为true后，在`createReactiveObject`中会被忽略

```js
function getTargetType(value: Target) {
  return value[ReactiveFlags.SKIP] || !Object.isExtensible(value)
    ? TargetType.INVALID
    : targetTypeMap(toRawType(value))
}
```

```js
// only a whitelist of value types can be observed.
const targetType = getTargetType(target)
if (targetType === TargetType.INVALID) {
  return target
}
```

`getTargetType`会返回`TargetType.INVALID`，在`targetType === TargetType.INVALID`判断中被直接返回

# 总结

1. 了解更多markRaw相关的特性可以看https://composition-api.vuejs.org/zh/api.html#markraw
2. 如果markRaw(value)中，value是响应式对象，那么markRaw返回的对象也是响应式对象