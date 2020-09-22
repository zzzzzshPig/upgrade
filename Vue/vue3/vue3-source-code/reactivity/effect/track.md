reactivity中核心的部分，追踪依赖所用

定义在`packages/reactivity/src/effect.ts`

# 类型

```js
export function track(target: object, type: TrackOpTypes, key: unknown)
```

target必须是对象

## TrackOpTypes

```js
export const enum TrackOpTypes {
  GET = 'get',
  HAS = 'has',
  ITERATE = 'iterate'
}
```

key为unknown，一般来说应该是string，但是也有可能是对象，因为`Map`的`key`可以是对象

# 实现

```js
export function track(target: object, type: TrackOpTypes, key: unknown) {
  if (!shouldTrack || activeEffect === undefined) {
    return
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
    if (__DEV__ && activeEffect.options.onTrack) {
      activeEffect.options.onTrack({
        effect: activeEffect,
        target,
        type,
        key
      })
    }
  }
}
```

```js
if (!shouldTrack || activeEffect === undefined) {
  return
}
```

当前不需要track或者没有正在执行的effect，就不需要追踪依赖

```js
let depsMap = targetMap.get(target)

const targetMap = new WeakMap<any, KeyToDepMap>()
type KeyToDepMap = Map<any, Dep>
type Dep = Set<ReactiveEffect>
```

从`targetMap`中取`target`这个`key`对应的`value`，`value`本身是`KeyToDepMap`类型，`KeyToDepMap`是`Map<any, Dep>`类型，`Dep`是`Set<ReactiveEffect>`，`ReactiveEffect`之前提到过，是`effect`的返回值，也就是说差不多类似于这种类型

```js
const targetMap = {
	targetObj: {
		keyObj: [effect1, effect2], // depSet
    keyString: [effect1, effect2], // depSet
	} // depsMap
} // targetMap
```

`target`一般指的是响应式对象，`targetMap`就是由`target`做为`key`的`Map`，它的值就是一堆依赖

```js
if (!depsMap) {
  targetMap.set(target, (depsMap = new Map()))
}
```

`targetMap`中不存在此`target`则需要插入新的`Map`也就是前面的示例中的`targetObj`，`depsMap`是由响应式对象的`key`做为`key`，`deps`做为`value`组成，也就是说每个`key`都有一堆依赖

```js
let dep = depsMap.get(key)
if (!dep) {
  depsMap.set(key, (dep = new Set()))
}
```

`depsMap`中不存在此`key`则需要插入新的`Map`也就是前面的示例中的`keyObj,keyString`，`dep`是各种依赖

```js
if (!dep.has(activeEffect)) {
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
  if (__DEV__ && activeEffect.options.onTrack) {
    activeEffect.options.onTrack({
      effect: activeEffect,
      target,
      type,
      key
    })
  }
}
```

`dep`中不存在当前正在执行的`effect`才会进行下一步，首先给`dep`添加`effect`，同时`effect`也添加`dep`，具体为什么要双向添加暂时先不管，之后会讲到。后面的`__DEV__`是给调试用的就不看了，这个是vue3的一个小特性，可以用来追踪数据变化信息