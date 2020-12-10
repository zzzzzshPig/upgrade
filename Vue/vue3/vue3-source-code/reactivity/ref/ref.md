定义在`packages/reactivity/src/ref.ts`

# 作用

接受一个参数值并返回一个响应式且可改变的 ref 对象。ref 对象拥有一个指向内部值的单一属性 `.value`

# 类型

```js
export function ref<T extends object>(
  value: T
): T extends Ref ? T : Ref<UnwrapRef<T>>
export function ref<T>(value: T): Ref<UnwrapRef<T>>
export function ref<T = any>(): Ref<T | undefined>
```

value可以是object，如果value是Ref类型则直接返回，不是则返回`Ref<UnwrapRef<T>>`

value可以是任意指定泛型T，返回`Ref<UnwrapRef<T>>`

value也可以不用传，这里是为了配合refs而产生的特性，返回`Ref<T | undefined>`

# 实现

```js
export function ref(value?: unknown) {
  return createRef(value)
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

> 官方解释是shallow为true时，不会对变更后的 `.value` 做响应式代理转换。但是测试发现`shallowRef`创建返回的值不是响应式对象，变更后的值也不是响应式对象

这里判断传入的值是不是ref，如果是ref则直接返回，不是则创建`RefImpl`对象

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

这里只看`_shallow`为false的情况，调用`convert(_rawValue)`

### convert-start

```js
const convert = <T extends unknown>(val: T): T =>
  isObject(val) ? reactive(val) : val
```

传入的如果是对象则调用reactive变为响应式对象

### convert-end

### get

```js
get value() {
  track(toRaw(this), TrackOpTypes.GET, 'value')
  return this._value
}
```

track是追踪依赖，暂时不看，这里对value的get直接就返回`this._value`

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

### hasChanged-start

```js
export const hasChanged = (value: any, oldValue: any): boolean =>
  value !== oldValue && (value === value || oldValue === oldValue)
```

判断value和`oldValue`是否相同，`value === value || oldValue === oldValue`可以判断`NaN`。

### hasChanged-end

当`newVal`和`_rawValue`不相同的时候替换`_rawValue`和`_value`的值，替换`_value`值的时候，还会再次调用convert一次，对传入的值进行转换。
