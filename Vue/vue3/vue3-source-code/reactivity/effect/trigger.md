reactivity中核心的部分，派发通知所用

定义在`packages/reactivity/src/effect.ts`

# 类型

```js
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>
)
```

target是对象，一般指发生变化的响应式对象

type是发生变化的类型

## TriggerOpTypes

```js
export const enum TriggerOpTypes {
  SET = 'set',
  ADD = 'add',
  DELETE = 'delete',
  CLEAR = 'clear'
}
```

有SET，ADD，DELETE，CLEAR操作，SET修改数据，ADD是新增数据，CLEAR和DELETE差不多都是删除数据

key是target对象中发生变化的key

newValue是新设置的值，SET和ADD操作必须要有

oldValue是之前的值，一般是用于调试或者watch中，SET，CLEAR，DELETE可能会有

oldTarget在CLEAR操作中会有，一般用于调试

# 实现

```js
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>
) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // never been tracked
    return
  }

  const effects = new Set<ReactiveEffect>()
  const add = (effectsToAdd: Set<ReactiveEffect> | undefined) => {
    if (effectsToAdd) {
      effectsToAdd.forEach(effect => effects.add(effect))
    }
  }

  if (type === TriggerOpTypes.CLEAR) {
    // collection being cleared
    // trigger all effects for target
    depsMap.forEach(add)
  } else if (key === 'length' && isArray(target)) {
    depsMap.forEach((dep, key) => {
      if (key === 'length' || key >= (newValue as number)) {
        add(dep)
      }
    })
  } else {
    // schedule runs for SET | ADD | DELETE
    if (key !== void 0) {
      add(depsMap.get(key))
    }
    // also run for iteration key on ADD | DELETE | Map.SET
    const shouldTriggerIteration =
      (type === TriggerOpTypes.ADD &&
        (!isArray(target) || isIntegerKey(key))) ||
      (type === TriggerOpTypes.DELETE && !isArray(target))
    if (
      shouldTriggerIteration ||
      (type === TriggerOpTypes.SET && target instanceof Map)
    ) {
      add(depsMap.get(isArray(target) ? 'length' : ITERATE_KEY))
    }
    if (shouldTriggerIteration && target instanceof Map) {
      add(depsMap.get(MAP_KEY_ITERATE_KEY))
    }
  }

  const run = (effect: ReactiveEffect) => {
    if (__DEV__ && effect.options.onTrigger) {
      effect.options.onTrigger({
        effect,
        target,
        key,
        type,
        newValue,
        oldValue,
        oldTarget
      })
    }
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      effect()
    }
  }

  effects.forEach(run)
}
```

```js
const depsMap = targetMap.get(target)
if (!depsMap) {
  // never been tracked
  return
}
```

target不存在与depsMap中表示未被追踪依赖，不需要trigger

```js
const effects = new Set<ReactiveEffect>()
const add = (effectsToAdd: Set<ReactiveEffect> | undefined) => {
  if (effectsToAdd) {
    effectsToAdd.forEach(effect => effects.add(effect))
  }
}
```

作用是添加Set中的所有effect到effects中，这个Set在track中提到过

```js
if (type === TriggerOpTypes.CLEAR) {
  // collection being cleared
  // trigger all effects for target
  depsMap.forEach(add)
}
```

对于CLEAR操作需要遍历target下所有的effect并添加到effects中

```js
else if (key === 'length' && isArray(target)) {
  depsMap.forEach((dep, key) => {
    if (key === 'length' || key >= (newValue as number)) {
      add(dep)
    }
  })
}
```

对于数组来说`newValue`参数应该是`index`，SET，ADD，DELETE操作需要通知`length`和所有`index`大于等与`newValue`的`item`

```js
else {
  // schedule runs for SET | ADD | DELETE
  if (key !== void 0) {
    add(depsMap.get(key))
  }
  // also run for iteration key on ADD | DELETE | Map.SET
  const shouldTriggerIteration =
    (type === TriggerOpTypes.ADD &&
      (!isArray(target) || isIntegerKey(key))) ||
    (type === TriggerOpTypes.DELETE && !isArray(target))
  if (
    shouldTriggerIteration ||
    (type === TriggerOpTypes.SET && target instanceof Map)
  ) {
    add(depsMap.get(isArray(target) ? 'length' : ITERATE_KEY))
  }
  if (shouldTriggerIteration && target instanceof Map) {
    add(depsMap.get(MAP_KEY_ITERATE_KEY))
  }
}
```

```js
// schedule runs for SET | ADD | DELETE
if (key !== void 0) {
  add(depsMap.get(key))
}
```

`key !== undefined`，则添加这个key对应的`Set<effect>`

```js
// also run for iteration key on ADD | DELETE | Map.SET
const shouldTriggerIteration =
  (type === TriggerOpTypes.ADD &&
    (!isArray(target) || isIntegerKey(key))) ||
  (type === TriggerOpTypes.DELETE && !isArray(target))
```

add操作且target不是数组 或 key不是数字样子的字符串

DELETE且target不是数组

## isIntegerKey

```js
export const isIntegerKey = (key: unknown) =>
  isString(key) && key[0] !== '-' && '' + parseInt(key, 10) === key
```

key是无符号数字即是isIntegerKey

```js
if (
  shouldTriggerIteration ||
  (type === TriggerOpTypes.SET && target instanceof Map)
) {
  add(depsMap.get(isArray(target) ? 'length' : ITERATE_KEY))
}
```

对target的SET, ADD, DELETE操作会造成target的`length`或者`size`发生变化，所以需要对`length`或者`ITERATE_KEY`派发通知，`ITERATE_KEY`在调试中会用到

```js
if (shouldTriggerIteration && target instanceof Map) {
  add(depsMap.get(MAP_KEY_ITERATE_KEY))
}
```

这里可以不看，针对Map的调试内容

```js
const run = (effect: ReactiveEffect) => {
  if (__DEV__ && effect.options.onTrigger) {
    effect.options.onTrigger({
      effect,
      target,
      key,
      type,
      newValue,
      oldValue,
      oldTarget
    })
  }
  if (effect.options.scheduler) {
    effect.options.scheduler(effect)
  } else {
    effect()
  }
}

effects.forEach(run)
```

最后循环处理所有effects

`__DEV__`内容跳过

`effect.options.scheduler`相当于是set回调，在派发通知的时候触发，如果没有设置`scheduler`，则调用`effect`，相当于默认的set回调

# 总结

triggle的本质是获取依赖于被修改内容的effects，然后依次调用这些effect的回调函数