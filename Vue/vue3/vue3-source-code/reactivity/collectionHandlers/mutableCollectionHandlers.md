定义在`packages/reactivity/src/collectionHandlers.ts`

# 作用

做为`reactive`中`createReactiveObject`创建的`proxy`对象的handler，针对`Map，Set，WeakMap，WeakSet`类型

> 为什么要区分类型？因为Map，Set，WeakMap，WeakSet比较特殊，只需要代理get，其他的无效。通过代理get监听对象的函数调用,  从而拦截并改造方法。

# 类型

```js
export const mutableCollectionHandlers: ProxyHandler<CollectionTypes>
  
export type CollectionTypes = IterableCollections | WeakCollections

type IterableCollections = Map<any, any> | Set<any>
type WeakCollections = WeakMap<any, any> | WeakSet<any>
```

类型是Proxy的第二个参数的类型，泛型是`Map，Set，WeakMap，WeakSet`

# 实现

```js
export const mutableCollectionHandlers: ProxyHandler<CollectionTypes> = {
  get: createInstrumentationGetter(false, false)
}
```

## get

### createInstrumentationGetter

```js
function createInstrumentationGetter(isReadonly: boolean, shallow: boolean) {
  const instrumentations = shallow
    ? shallowInstrumentations
    : isReadonly
      ? readonlyInstrumentations
      : mutableInstrumentations

  return (
    target: CollectionTypes,
    key: string | symbol,
    receiver: CollectionTypes
  ) => {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.RAW) {
      return target
    }

    return Reflect.get(
      hasOwn(instrumentations, key) && key in target
        ? instrumentations
        : target,
      key,
      receiver
    )
  }
}
```

```js
const instrumentations = shallow
  ? shallowInstrumentations
  : isReadonly
    ? readonlyInstrumentations
    : mutableInstrumentations
```

`instrumentations`等于`mutableInstrumentations`，先看下面的部分，等下再来讲具体代码

下面的代码返回一个函数，看函数内部逻辑

```js
if (key === ReactiveFlags.IS_REACTIVE) {
  return !isReadonly
} else if (key === ReactiveFlags.IS_READONLY) {
  return isReadonly
} else if (key === ReactiveFlags.RAW) {
  return target
}
```

访问flag标签就根据相应的情况返回值

```js
return Reflect.get(
  hasOwn(instrumentations, key) && key in target
    ? instrumentations
    : target,
  key,
  receiver
)
```

```js
hasOwn(instrumentations, key) && key in target
    ? instrumentations
    : target,
```

这里是最核心的逻辑，用到了`instrumentations`，来看看是什么，前面提到过，它当前为`mutableInstrumentations`

#### mutableInstrumentations

```js
const mutableInstrumentations: Record<string, Function> = {
  get(this: MapTypes, key: unknown) {
    return get(this, key)
  },
  get size() {
    return size((this as unknown) as IterableCollections)
  },
  has,
  add,
  set,
  delete: deleteEntry,
  clear,
  forEach: createForEach(false, false)
}
```

可以看到，这里其实是`Map,Set,WeakMap,WeakSet`方法，结合上面的逻辑可以看到，这里其实就是拦截了`Map,Set,WeakMap,WeakSet`的方法，先来看get

##### get

```js
function get(
  target: MapTypes,
  key: unknown,
  isReadonly = false,
  isShallow = false
) {
  // #1772: readonly(reactive(Map)) should return readonly + reactive version
  // of the value
  target = (target as any)[ReactiveFlags.RAW]
  const rawTarget = toRaw(target)
  const rawKey = toRaw(key)
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, TrackOpTypes.GET, key)
  }
  !isReadonly && track(rawTarget, TrackOpTypes.GET, rawKey)
  const { has } = getProto(rawTarget)
  const wrap = isReadonly ? toReadonly : isShallow ? toShallow : toReactive
  if (has.call(rawTarget, key)) {
    return wrap(target.get(key))
  } else if (has.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey))
  }
}
```

```js
target = (target as any)[ReactiveFlags.RAW]
const rawTarget = toRaw(target)
const rawKey = toRaw(key)
```

获取原始target和key，因为它们有可能是Vue的响应式对象，对于`Map`来说，`key`也需要toRaw是因为它们有可能是对象

```js
if (key !== rawKey) {
  !isReadonly && track(rawTarget, TrackOpTypes.GET, key)
}
```

key如果是响应式对象，需要对key也追踪依赖

```js
!isReadonly && track(rawTarget, TrackOpTypes.GET, rawKey)
```

对rawKey追踪依赖

```js
const { has } = getProto(rawTarget)
```

获取has方法

```js
const wrap = isReadonly ? toReadonly : isShallow ? toShallow : toReactive
```

根据类型选择不同的包装函数

```js
if (has.call(rawTarget, key)) {
  return wrap(target.get(key))
} else if (has.call(rawTarget, rawKey)) {
  return wrap(target.get(rawKey))
}
```

对get到的值进行响应式转换，lazyload行为，用到才转，不用到不转

##### set

```js
function set(this: MapTypes, key: unknown, value: unknown) {
  value = toRaw(value)
  const target = toRaw(this)
  const { has, get, set } = getProto(target)

  let hadKey = has.call(target, key)
  if (!hadKey) {
    key = toRaw(key)
    hadKey = has.call(target, key)
  } else if (__DEV__) {
    checkIdentityKeys(target, has, key)
  }

  const oldValue = get.call(target, key)
  const result = set.call(target, key, value)
  if (!hadKey) {
    trigger(target, TriggerOpTypes.ADD, key, value)
  } else if (hasChanged(value, oldValue)) {
    trigger(target, TriggerOpTypes.SET, key, value, oldValue)
  }
  return result
}
```

```js
value = toRaw(value)
const target = toRaw(this)
const { has, get, set } = getProto(target)
```

获取value的原始值，获取原始的target，获取`has,get,set`方法

```js
let hadKey = has.call(target, key)
if (!hadKey) {
  key = toRaw(key)
  hadKey = has.call(target, key)
} else if (__DEV__) {
  checkIdentityKeys(target, has, key)
}
```

先判断`target.has(key)`，如果不存在再判断`has.call(target, toRaw(key))`，用来确定key的响应式版本或者原始版本是否在target中，`checkIdentityKeys`中的警告是Vue3针对key设置的建议

```js
const oldValue = get.call(target, key)
const result = set.call(target, key, value)
if (!hadKey) {
  trigger(target, TriggerOpTypes.ADD, key, value)
} else if (hasChanged(value, oldValue)) {
  trigger(target, TriggerOpTypes.SET, key, value, oldValue)
}
return result
```

set的操作就在这里实现，如果hadKey是false，则代表是新增的key，trigger的类型为ADD，否则是修改存在的key的值，trigger的类型为SET，最后返回操作后的结果

##### size

```js
function size(target: IterableCollections, isReadonly = false) {
  target = (target as any)[ReactiveFlags.RAW]
  !isReadonly && track(toRaw(target), TrackOpTypes.ITERATE, ITERATE_KEY)
  return Reflect.get(target, 'size', target)
}
```

对size追踪依赖，然后返回操作结果

##### has

```js
function has(this: CollectionTypes, key: unknown, isReadonly = false): boolean {
  const target = (this as any)[ReactiveFlags.RAW]
  const rawTarget = toRaw(target)
  const rawKey = toRaw(key)
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, TrackOpTypes.HAS, key)
  }
  !isReadonly && track(rawTarget, TrackOpTypes.HAS, rawKey)
  return key === rawKey
    ? target.has(key)
    : target.has(key) || target.has(rawKey)
}
```

对key和rawKey追踪依赖，然后返回操作结果，响应式对象和它的原始对象两个做为key都可以进行判断，如下

```js
const a = { a: 1 }
const b = reactive(a)
const c = reactive(new Map())
c.set(b, 1)
console.log(c.has(b)) // true
console.log(c.has(a)) // true
```

##### add

```js
function add(this: SetTypes, value: unknown) {
  value = toRaw(value)
  const target = toRaw(this)
  const proto = getProto(target)
  const hadKey = proto.has.call(target, value)
  const result = proto.add.call(target, value)
  if (!hadKey) {
    trigger(target, TriggerOpTypes.ADD, value, value)
  }
  return result
}
```

set的add方法，告诉依赖有ADD操作触发

##### delete

```js
function deleteEntry(this: CollectionTypes, key: unknown) {
  const target = toRaw(this)
  const { has, get, delete: del } = getProto(target)
  let hadKey = has.call(target, key)
  if (!hadKey) {
    key = toRaw(key)
    hadKey = has.call(target, key)
  } else if (__DEV__) {
    checkIdentityKeys(target, has, key)
  }

  const oldValue = get ? get.call(target, key) : undefined
  // forward the operation before queueing reactions
  const result = del.call(target, key)
  if (hadKey) {
    trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue)
  }
  return result
}
```

hadKey部分的逻辑和set的一样，跳过。看下半部分

```js
const oldValue = get ? get.call(target, key) : undefined
// forward the operation before queueing reactions
const result = del.call(target, key)
if (hadKey) {
  trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue)
}
return result
```

通知依赖有DELETE操作触发

##### clear

```js
function clear(this: IterableCollections) {
  const target = toRaw(this)
  const hadItems = target.size !== 0
  const oldTarget = __DEV__
    ? target instanceof Map
      ? new Map(target)
      : new Set(target)
    : undefined
  // forward the operation before queueing reactions
  const result = getProto(target).clear.call(target)
  if (hadItems) {
    trigger(target, TriggerOpTypes.CLEAR, undefined, undefined, oldTarget)
  }
  return result
}
```

`oldTarget`是调试用的可以不用看，hadItems表示当前clear操作的时候，Map或Set中还有元素，如果存在则通知依赖有CLEAR操作触发

##### forEach

```js
forEach: createForEach(false, false)
```

```js
function createForEach(isReadonly: boolean, isShallow: boolean) {
  return function forEach(
    this: IterableCollections,
    callback: Function,
    thisArg?: unknown
  ) {
    const observed = this as any
    const target = observed[ReactiveFlags.RAW]
    const rawTarget = toRaw(target)
    const wrap = isReadonly ? toReadonly : isShallow ? toShallow : toReactive
    !isReadonly && track(rawTarget, TrackOpTypes.ITERATE, ITERATE_KEY)
    return target.forEach((value: unknown, key: unknown) => {
      // important: make sure the callback is
      // 1. invoked with the reactive map as `this` and 3rd arg
      // 2. the value received should be a corresponding reactive/readonly.
      return callback.call(thisArg, wrap(value), wrap(key), observed)
    })
  }
}
```

```js
!isReadonly && track(rawTarget, TrackOpTypes.ITERATE, ITERATE_KEY)
```

追踪依赖

```js
return target.forEach((value: unknown, key: unknown) => {
  // important: make sure the callback is
  // 1. invoked with the reactive map as `this` and 3rd arg
  // 2. the value received should be a corresponding reactive/readonly.
  return callback.call(thisArg, wrap(value), wrap(key), observed)
})
```

将子对象变成响应式对象，value和key都尝试转换

