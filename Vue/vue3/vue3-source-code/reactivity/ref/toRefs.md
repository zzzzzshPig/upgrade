定义在`packages/reactivity/src/ref.ts`

# 作用

把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref ，和响应式对象 property 一一对应

# 类型

```js
export function toRefs<T extends object>(object: T): ToRefs<T> 
```

传入一个对象，返回`ToRefs<T>` 之后的对象

```js
export type ToRefs<T = any> = { [K in keyof T]: Ref<T[K]> }
```

将T的每一个属性都转换成Ref类型

# 实现

```js
export function toRefs<T extends object>(object: T): ToRefs<T> {
  if (__DEV__ && !isProxy(object)) {
    console.warn(`toRefs() expects a reactive object but received a plain one.`)
  }
  const ret: any = isArray(object) ? new Array(object.length) : {}
  for (const key in object) {
    ret[key] = toRef(object, key)
  }
  return ret
}
```

在开发环境下，不是proxy对象报警告。针对数组和对象赋不同的初始值，然后循环object的属性将每一个属性都转换成Ref