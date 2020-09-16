定义在`packages/reactivity/src/baseHandlers.ts`

# demo

```js
reactive({a: 1})
```

# 作用

在reactive下的`createReactiveObject`中使用，在为`object,array`类型进行`proxy`的时候使用

# 类型

```js
export const mutableHandlers: ProxyHandler<object>ProxyHandler<object>
```

类型是Proxy的第二个参数的类型

# 实现

```js
export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
}
```

## get

```js
const get = /*#__PURE__*/ createGetter()
```

### createGetter

```js
function createGetter(isReadonly = false, shallow = false) {
  return function get(target: Target, key: string | symbol, receiver: object) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (
      key === ReactiveFlags.RAW &&
      receiver === (isReadonly ? readonlyMap : reactiveMap).get(target)
    ) {
      return target
    }

    const targetIsArray = isArray(target)
    if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver)
    }

    const res = Reflect.get(target, key, receiver)

    const keyIsSymbol = isSymbol(key)
    if (
      keyIsSymbol
        ? builtInSymbols.has(key as symbol)
        : key === `__proto__` || key === `__v_isRef`
    ) {
      return res
    }

    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key)
    }

    if (shallow) {
      return res
    }

    if (isRef(res)) {
      // ref unwrapping - does not apply for Array + integer key.
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key)
      return shouldUnwrap ? res.value : res
    }

    if (isObject(res)) {
      // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}
```

从set函数开始，一点点分析

```js
if (key === ReactiveFlags.IS_REACTIVE) {
  return !isReadonly
} else if (key === ReactiveFlags.IS_READONLY) {
  return isReadonly
} else if (
  key === ReactiveFlags.RAW &&
  receiver === (isReadonly ? readonlyMap : reactiveMap).get(target)
) {
  return target
}
```

key是获取的属性名，如`obj.a`，key指的就是a

* `key === ReactiveFlags.IS_REACTIVE`会在`obj['__v_isReactive']`时触发，返回`!isReadonly`
* `key === ReactiveFlags.IS_READONLY`会在`obj['__v_isReadonly']`时触发，返回`isReadonly`
* `key === ReactiveFlags.RAW`会在`obj['__v_raw']`时触发，`receiver === (isReadonly ? readonlyMap : reactiveMap).get(target)`是用来判断是否被reactive的proxy代理，返回原始对象`target`

```js
const targetIsArray = isArray(target)
if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
  return Reflect.get(arrayInstrumentations, key, receiver)
}
```

首先判断target是不是Array，如果是并且`arrayInstrumentations`自身属性中含有key则返回`Reflect.get(arrayInstrumentations, key, receiver)`，这里实际上是劫持了数组的三个方法`includes,indexOf,lastIndexOf`

#### arrayInstrumentations-start

```js
const arrayInstrumentations: Record<string, Function> = {}
;['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
  arrayInstrumentations[key] = function(...args: any[]): any {
    const arr = toRaw(this) as any
    for (let i = 0, l = (this as any).length; i < l; i++) {
      track(arr, TrackOpTypes.GET, i + '')
    }
    // we run the method using the original args first (which may be reactive)
    const res = arr[key](...args)
    if (res === -1 || res === false) {
      // if that didn't work, run it again using raw values.
      return arr[key](...args.map(toRaw))
    } else {
      return res
    }
  }
})
```

代码中的`this`指向的是`receiver`，`receiver`指的是`Proxy`对象，在本例中就是`reactive`返回的`proxy`对象。首先对`arr`中的每一个元素进行`track`依赖追踪，然后再调用原生方法获取结果，如果结果为-1或者false则尝试把数组中的每一项`toRaw`取原始值再次调用原生方法（感觉像是性能优化，不是太理解为什么这么做）

#### arrayInstrumentations-end

```js
const res = Reflect.get(target, key, receiver)
```

获取属性值

```js
const keyIsSymbol = isSymbol(key)
if (
  keyIsSymbol
    ? builtInSymbols.has(key as symbol)
    : key === `__proto__` || key === `__v_isRef`
) {
  return res
}
```

对于key是symbol情况，需判断`builtInSymbols.has(key as symbol)`，`builtInSymbols`是`Js`自带的`Symbol`，符合条件则直接返回res，否则如果key是`__proto__`或者`__v_isRef`，也直接返回res

```js
if (!isReadonly) {
  track(target, TrackOpTypes.GET, key)
}
```

如果是非只读的，则开始追踪依赖

```js
if (shallow) {
  return res
}
```

如果shallow为true，直接返回res即可，res不会被设置为响应式对象，这是Vue3中shallow的特性

```js
if (isRef(res)) {
  // ref unwrapping - does not apply for Array + integer key.
  const shouldUnwrap = !targetIsArray || !isIntegerKey(key)
  return shouldUnwrap ? res.value : res
}
```

ref不需要再次变为响应式对象，所以直接返回res.value，对于数组则不会自动`wrap`，这里暂时不明白为什么不给数组的元素自动wrap

```js
if (isObject(res)) {
  // Convert returned value into a proxy as well. we do the isObject check
  // here to avoid invalid value warning. Also need to lazy access readonly
  // and reactive here to avoid circular dependency.
  return isReadonly ? readonly(res) : reactive(res)
}
```

如果res是对象，则需要再次进行响应式监听，也就是说只有在用到响应式对象的某个属性的时候才会把属性值转为响应式对象，这是一个`lazyLoad`的概念

## set

### createSetter

```js
function createSetter(shallow = false) {
  return function set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ): boolean {
    const oldValue = (target as any)[key]
    if (!shallow) {
      value = toRaw(value)
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value
        return true
      }
    } else {
      // in shallow mode, objects are set as-is regardless of reactive or not
    }

    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key)
    const result = Reflect.set(target, key, value, receiver)
    // don't trigger if target is something up in the prototype chain of original
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, TriggerOpTypes.ADD, key, value)
      } else if (hasChanged(value, oldValue)) {
        trigger(target, TriggerOpTypes.SET, key, value, oldValue)
      }
    }
    return result
  }
}
```

从set函数开始，一点一点分析

```js
const oldValue = (target as any)[key]
if (!shallow) {
  value = toRaw(value)
  if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
    oldValue.value = value
    return true
  }
} else {
  // in shallow mode, objects are set as-is regardless of reactive or not
}
```

先获取set之前的值，也就是`oldValue`，对于非shallow的proxy对象来说，先获取`value`的原始值（因为value有可能是一个Vue的响应式对象）

