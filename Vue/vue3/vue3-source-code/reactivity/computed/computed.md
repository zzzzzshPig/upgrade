定义在`packages/reactivity/src/computed.ts`

# 作用

传入一个 getter 函数，返回一个默认不可手动修改的 ref 对象

或者传入一个拥有 `get` 和 `set` 函数的对象，创建一个可手动修改的计算状态

# 类型

```js
export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>
export function computed<T>(
  options: WritableComputedOptions<T>
): WritableComputedRef<T>

export type ComputedGetter<T> = (ctx?: any) => T

export interface ComputedRef<T = any> extends WritableComputedRef<T> {
  readonly value: T
}

export interface WritableComputedRef<T> extends Ref<T> {
  readonly effect: ReactiveEffect<T>
}
```

getter是`ComputedGetter<T>`类型，返回`ComputedRef<T>`，这里将`WritableComputedRef`继承自`Ref`的value给覆盖增加了`readonly`

# 实现

```js
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>

  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = __DEV__
      ? () => {
          console.warn('Write operation failed: computed value is readonly')
        }
      : NOOP
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  return new ComputedRefImpl(
    getter,
    setter,
    isFunction(getterOrOptions) || !getterOrOptions.set
  ) as any
}
```

首先对`getterOrOptions`进行判断，如果是函数则表示`getter`，所以直接给`getter`赋值，`setter`给默认值。否则就取`getterOrOptions`的`get,set`属性，最后实例化`ComputedRefImpl`

## ComputedRefImpl

```js
class ComputedRefImpl<T> {
  private _value!: T
  private _dirty = true

  public readonly effect: ReactiveEffect<T>

  public readonly __v_isRef = true;
  public readonly [ReactiveFlags.IS_READONLY]: boolean

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    isReadonly: boolean
  ) {
    this.effect = effect(getter, {
      lazy: true,
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true
          trigger(toRaw(this), TriggerOpTypes.SET, 'value')
        }
      }
    })

    this[ReactiveFlags.IS_READONLY] = isReadonly
  }

  get value() {
    if (this._dirty) {
      this._value = this.effect()
      this._dirty = false
    }
    track(toRaw(this), TrackOpTypes.GET, 'value')
    return this._value
  }

  set value(newValue: T) {
    this._setter(newValue)
  }
}
```

先来看`constructor`部分

```js
constructor(
  getter: ComputedGetter<T>,
  private readonly _setter: ComputedSetter<T>,
  isReadonly: boolean
) {
  this.effect = effect(getter, {
    lazy: true,
    scheduler: () => {
      if (!this._dirty) {
        this._dirty = true
        trigger(toRaw(this), TriggerOpTypes.SET, 'value')
      }
    }
  })

  this[ReactiveFlags.IS_READONLY] = isReadonly
}
```

effect我们到讲effect的时候再说，它会返回一个函数，调用函数相当于调用`getter`，然后根据`isReadonly`设置computed的`readonly`属性

### get

```js
get value() {
  if (this._dirty) {
    this._value = this.effect()
    this._dirty = false
  }
  track(toRaw(this), TrackOpTypes.GET, 'value')
  return this._value
}
```

`_dirty`为脏值检查机制，为true表示需要重新计算一次值，计算完之后返回`this._value`

### set

```js
set value(newValue: T) {
  this._setter(newValue)
}
```

直接调用传入的`_setter`即可，因为本身是ref，如果在模板中使用了`computed`，改变了computed的value属性也会有响应式变化，从而更新模板

# 总结

computed是一个`effct`语法糖