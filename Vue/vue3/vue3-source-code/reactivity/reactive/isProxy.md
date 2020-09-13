文件定义在`packages/reactivity/src/reactive.ts`

# 作用

检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理

# 类型

```js
export function isProxy(value: unknown): boolean 
```

传入任意类型，返回`boolean`

# 实现

```js
export function isProxy(value: unknown): boolean {
  return isReactive(value) || isReadonly(value)
}
```

判断value是不是具有`ReactiveFlags.IS_READONLY || ReactiveFlags.IS_REACTIVE`属性

这个判断可以伪造，如下

> ```js
> isProxy({ __v_isReadonly: true, __v_isReactive: true }) // true
> ```

