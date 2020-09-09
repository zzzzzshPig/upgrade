文件定义在`packages/reactivity/src/reactive.ts`

# 作用

检查一个对象是否是由 `readonly` 创建的只读代理。

# 类型定义

```js
export function isReadonly(value: unknown): boolean 
```

传入任意类型，返回`boolean`

# 具体实现

```js
export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}
```

判断value是不是具有`ReactiveFlags.IS_READONLY`属性

这个判断可以伪造，如下

> ```js
> isReadonly({ __v_isReadonly: true }) // true
> ```

