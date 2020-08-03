update的逻辑比较简单，就是强制渲染子组件即可，在对组件进行重新渲染的时候会走diff过程，实际上就是patchVnode，定义在`core/vdom/patch.js`。

# patchVNode

```js
let i
const data = vnode.data
if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
  i(oldVnode, vnode)
}
```

在这里调用组件的prepatch hook，它定义在`core/vdom/create-component.js`。

## prepatch

```js
prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
  const options = vnode.componentOptions
  const child = vnode.componentInstance = oldVnode.componentInstance
  updateChildComponent(
    child,
    options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
  )
}
```

这里就是简单的调用了updateChildComponent

### updateChildComponent

```js
const newScopedSlots = parentVnode.data.scopedSlots
const oldScopedSlots = vm.$scopedSlots
const hasDynamicScopedSlot = !!(
  (newScopedSlots && !newScopedSlots.$stable) ||
  (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
  (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
)

// Any static slot children from the parent may have changed during parent's
// update. Dynamic scoped slots may also have changed. In such cases, a forced
// update is necessary to ensure correctness.
const needsForceUpdate = !!(
  renderChildren ||               // has new static slots
  vm.$options._renderChildren ||  // has old static slots
  hasDynamicScopedSlot
)
```

先看这一部分，这一部分是关于slot的，最后会得到一个needsForceUpdate的布尔值，这里就是判断组件有没有slot部分，其实注释也说得很清楚了

```js
// resolve slots + force update if has children
if (needsForceUpdate) {
  vm.$slots = resolveSlots(renderChildren, parentVnode.context)
  vm.$forceUpdate()
}
```

对存在slot的情况强制渲染，resolveSlots我们说过就不再赘述。



# 总结

1. 对于含有slot的组件的update实际上就是强制更新组件

