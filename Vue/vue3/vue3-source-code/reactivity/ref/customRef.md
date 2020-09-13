定义在`packages/reactivity/src/ref.ts`

# 作用

`customRef` 用于自定义一个 `ref`，可以显式地控制依赖追踪和触发响应，接受一个工厂函数，两个参数分别是用于追踪的 `track` 与用于触发响应的 `trigger`，并返回一个带有 `get` 和 `set` 属性的对象。

# 类型

```js
export function customRef<T>(factory: CustomRefFactory<T>): Ref<T>
```

```js
export type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void
) => {
  get: () => T
  set: (value: T) => void
}
```

参数是一个工厂函数，有两个参数，`track,trigger`，debug用的先不讨论，工厂函数返回一个有`get,set`属性的对象用以替换默认行为

# 实现

```js
export function customRef<T>(factory: CustomRefFactory<T>): Ref<T> {
  return new CustomRefImpl(factory) as any
}
```

## CustomRefImpl

```js
class CustomRefImpl<T> {
  private readonly _get: ReturnType<CustomRefFactory<T>>['get']
  private readonly _set: ReturnType<CustomRefFactory<T>>['set']

  public readonly __v_isRef = true

  constructor(factory: CustomRefFactory<T>) {
    const { get, set } = factory(
      () => track(this, TrackOpTypes.GET, 'value'),
      () => trigger(this, TriggerOpTypes.SET, 'value')
    )
    this._get = get
    this._set = set
  }

  get value() {
    return this._get()
  }

  set value(newVal) {
    this._set(newVal)
  }
}
```

先来看`constructor`部分

```js
constructor(factory: CustomRefFactory<T>) {
  const { get, set } = factory(
    () => track(this, TrackOpTypes.GET, 'value'),
    () => trigger(this, TriggerOpTypes.SET, 'value')
  )
  this._get = get
  this._set = set
}
```

调用factory，传入`track,trigger`，将返回的`get,set`设置为私有属性

### get

```js
get value() {
  return this._get()
}
```

调用自定义get

### set

```js
set value(newVal) {
  this._set(newVal)
}
```

调用自定义set
