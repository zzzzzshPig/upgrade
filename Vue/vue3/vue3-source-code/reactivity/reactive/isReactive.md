文件定义在`packages/reactivity/src/reactive.ts`

# 作用

检查一个对象是否是由 `reactive` 创建的响应式代理。

如果这个代理是由 `readonly` 创建的，但是又被 `reactive` 创建的另一个代理包裹了一层，那么同样也会返回 `true`。

# 类型定义

```js
export function isReactive(value: unknown): boolean 
```

传入任意类型，返回`boolean`

# 具体实现

```js
if (isReadonly(value)) {
  return isReactive((value as Target)[ReactiveFlags.RAW])
}
```

如果这个代理是由 `readonly` 创建的，但是又被 `reactive` 创建的另一个代理包裹了一层，那么同样也会返回 `true`。

```js
return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
```

判断value是不是具有`ReactiveFlags.IS_REACTIVE`属性

这个判断可以伪造，如下

> ```js
> isReactive({ __v_isReactive: true }) // true
> ```

