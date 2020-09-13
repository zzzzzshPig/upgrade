定义在`packages/reactivity/src/ref.ts`

# 作用

`toRef` 可以用来为一个 reactive 对象的属性创建一个 ref。这个 ref 可以被传递并且能够保持响应性

# 类型

```js
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K
): Ref<T[K]>
```

两个泛型，`T,K`，T是object，K是T的属性名，返回`Ref<T[K]>`

# 实现

```js
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K
): Ref<T[K]> {
  return new ObjectRefImpl(object, key) as any
}
```

## ObjectRefImpl

```js
class ObjectRefImpl<T extends object, K extends keyof T> {
  public readonly __v_isRef = true

  constructor(private readonly _object: T, private readonly _key: K) {}

  get value() {
    return this._object[this._key]
  }

  set value(newVal) {
    this._object[this._key] = newVal
  }
}
```

先来看`constructor`部分

```js
constructor(private readonly _object: T, private readonly _key: K) {}
```

初始化`_object, _key`两个私有属性

### get

```js
get value() {
  return this._object[this._key]
}
```

返回对象对应的属性

### set

```js
set value(newVal) {
  this._object[this._key] = newVal
}
```

设置对象对应属性的值

# 总结

这里的作用实际上是把`object[key]`包了一层，标识了`__v_isRef`属性为true，其他的并没有任何变化