定义在`packages/reactivity/src/ref.ts`

# 作用

如果参数是一个 ref 则返回它的 `value`，否则返回参数本身。它是 `val = isRef(val) ? val.value : val` 的语法糖

# 类型

```js
export function unref<T>(ref: T): T extends Ref<infer V> ? V : T
```

ref是泛型，返回值取决于ref参数的类型，如果是Ref类型则返回`.value`，否则返回ref

# 实现

```js
export function unref<T>(ref: T): T extends Ref<infer V> ? V : T {
  return isRef(ref) ? (ref.value as any) : ref
}
```

如果参数是一个 ref 则返回它的 `value`，否则返回参数本身