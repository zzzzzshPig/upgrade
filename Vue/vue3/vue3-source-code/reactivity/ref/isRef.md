定义在`packages/reactivity/src/ref.ts`

# 作用

检查一个值是否为一个 ref 对象

# 类型

```js
export function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
```

r可以是Ref，也可以是任意类型

# 实现

```js
export function isRef(r: any): r is Ref {
  return Boolean(r && r.__v_isRef === true
}
```

判断r的`__v_isRef`属性