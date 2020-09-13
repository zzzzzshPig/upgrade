定义在`packages/reactivity/src/ref.ts`

# 作用

创建一个 ref ，将会追踪它的 `.value` 更改操作，但是并不会对变更后的 `.value` 做响应式代理转换（即变更不会调用 `reactive`）

# 类型

```js
export function shallowRef<T extends object>(
  value: T
): T extends Ref ? T : Ref<T>
export function shallowRef<T>(value: T): Ref<T>
export function shallowRef<T = any>(): Ref<T | undefined>
```

value可以是object，如果value是Ref类型则直接返回，不是则返回`Ref<T>`

value可以是任意指定泛型T，返回`Ref<T>`

value也可以不用传，这里是为了配合refs而产生的特性，返回`Ref<T | undefined>`

# 实现

```js
export function shallowRef(value?: unknown) {
  return createRef(value, true)
}
```

## createRef

```js
function createRef(rawValue: unknown, shallow = false) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}
```

和ref的区别在于shallow参数为true

## RefImpl

```js
class RefImpl<T> {
  private _value: T

  public readonly __v_isRef = true

  constructor(private _rawValue: T, private readonly _shallow = false) {
    this._value = _shallow ? _rawValue : convert(_rawValue)
  }

  get value() {
    track(toRaw(this), TrackOpTypes.GET, 'value')
    return this._value
  }

  set value(newVal) {
    if (hasChanged(toRaw(newVal), this._rawValue)) {
      this._rawValue = newVal
      this._value = this._shallow ? newVal : convert(newVal)
      trigger(toRaw(this), TriggerOpTypes.SET, 'value', newVal)
    }
  }
}
```

先来看`constructor`部分

```js
constructor(private _rawValue: T, private readonly _shallow = false) {
  this._value = _shallow ? _rawValue : convert(_rawValue)
}
```

这里只看`_shallow`为true的情况，直接等于传入的值

### get

```js
get value() {
  track(toRaw(this), TrackOpTypes.GET, 'value')
  return this._value
}
```

track是debug相关，暂时不看，这里对value的get直接就返回`this._value`

### set

```js
set value(newVal) {
  if (hasChanged(toRaw(newVal), this._rawValue)) {
    this._rawValue = newVal
    this._value = this._shallow ? newVal : convert(newVal)
    trigger(toRaw(this), TriggerOpTypes.SET, 'value', newVal)
  }
}
```

这里和ref的不同在于`this._value`的值为`newVal`