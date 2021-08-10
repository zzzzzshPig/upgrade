### Type

```typescript
export function useActiveElement<T extends HTMLElement>(options: ConfigurableWindow = {})
```

#### ConfigurableWindow

参考`../types/index`

### Content

```typescript
const { window = defaultWindow } = options
```

`defaultWindow`见`_configurable.md`

```typescript
const counter = ref(0)
```

这个变量的声明主要是为了computed能触发更新

```typescript
if (window) {
  useEventListener(window, 'blur', () => counter.value += 1, true)
  useEventListener(window, 'focus', () => counter.value += 1, true)
}
```

useEventListener见`useEventListener.md`

这里的意思是，当浏览器失去和获取焦点的时候（也就是更换了选中的元素），修改counter的值触发computed重新计算

```js
return computed(() => {
  // eslint-disable-next-line no-unused-expressions
  counter.value
  return window?.document.activeElement as T | null | undefined
})
```

在computed触发计算之时，返回`window?.document.activeElement`浏览器中激活的元素

### 总结

如果是我做这个功能，我可能会这样写

```typescript
const { window = defaultWindow } = options
const elm = ref(window?.document.activeElement)

if (window) {
  ['blur', 'focus'].forEach((a) => {
    useEventListener(window, a, () => elm.value = window?.document.activeElement, true)
  })
}

return elm
```

源码的这种写法我确实没有想过，虽然有点绕但却把响应式用的很熟练，可以借鉴这种骚操作，可能没多大区别但就是帅