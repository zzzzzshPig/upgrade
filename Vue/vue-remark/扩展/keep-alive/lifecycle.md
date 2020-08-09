keep-alive的生命周期是activated和deactivated

先来看activated

# activated

activated发生在mounted之后，也就是invokeInsertHook的时候

## invokeInsertHook

```js
function invokeInsertHook (vnode, queue, initial) {
  // delay insert hooks for component root nodes, invoke them after the
  // element is really inserted
  if (isTrue(initial) && isDef(vnode.parent)) {
    vnode.parent.data.pendingInsert = queue
  } else {
    for (let i = 0; i < queue.length; ++i) {
      queue[i].data.hook.insert(queue[i])
    }
  }
}
```

这里会调用insert hook

## hook:insert

```js
insert (vnode: MountedComponentVNode) {
  const { context, componentInstance } = vnode
  if (!componentInstance._isMounted) {
    componentInstance._isMounted = true
    callHook(componentInstance, 'mounted')
  }
  if (vnode.data.keepAlive) {
    if (context._isMounted) {
      // vue-router#1212
      // During updates, a kept-alive component's child components may
      // change, so directly walking the tree here may call activated hooks
      // on incorrect children. Instead we push them into a queue which will
      // be processed after the whole patch process ended.
      queueActivatedComponent(componentInstance)
    } else {
      activateChildComponent(componentInstance, true /* direct */)
    }
  }
}
```

在首次渲染的时候，context._isMounted，因为context此时是keep-alive对应的parent instance，由于组件的mounted是先子后父，所以这里不会走queueActivatedComponent而是走activateChildComponent

## activateChildComponent

定义在`core/instance/lifecycle.js`

```js
if (direct) {
  vm._directInactive = false
  if (isInInactiveTree(vm)) {
    return
  }
} else if (vm._directInactive) {
  return
}
```

direct此时是true，会走isInInactiveTree

### isInInactiveTree-start

```js
function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) return true
  }
  return false
}
```

返回祖先节点的`vm._inactive`，这里我们知道_inactive的默认值是null，所以首次渲染时不会return

`vm._inactive`在`initLifecycle`中被定义

### initLifecycle

```js
vm._inactive = null
vm._directInactive = false
```

### isInInactiveTree-end

```js
if (vm._inactive || vm._inactive === null) {
  vm._inactive = false
  for (let i = 0; i < vm.$children.length; i++) {
    activateChildComponent(vm.$children[i])
  }
  callHook(vm, 'activated')
}
```

因为`vm._inactive`为null，所以会走这里。for循环是对所有后代元素进activated hook通知，这里是keep-alive的一个特性，会通知所有后代元素的相关hook。

# deactivated

deactivated肯定发生在keep-alive切换组件的时候，也就是patchVnode之后(update)，在patch函数的最后

```js
// destroy old node
if (isDef(parentElm)) {
  removeVnodes([oldVnode], 0, 0)
} else if (isDef(oldVnode.tag)) {
  invokeDestroyHook(oldVnode)
}
```

这里走removeVnodes

## removeVnodes

```js
function removeVnodes (vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (isDef(ch)) {
      if (isDef(ch.tag)) {
        removeAndInvokeRemoveHook(ch)
        invokeDestroyHook(ch)
      } else { // Text node
        removeNode(ch.elm)
      }
    }
  }
}
```

keep-alive相关的是invokeDestroyHook

## invokeDestroyHook

```js
function invokeDestroyHook (vnode) {
  let i, j
  const data = vnode.data
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode)
    for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
  }
  if (isDef(i = vnode.children)) {
    for (j = 0; j < vnode.children.length; ++j) {
      invokeDestroyHook(vnode.children[j])
    }
  }
}
```

这里看destroy hook

## hook:destroy

```js
destroy (vnode: MountedComponentVNode) {
  const { componentInstance } = vnode
  if (!componentInstance._isDestroyed) {
    if (!vnode.data.keepAlive) {
      componentInstance.$destroy()
    } else {
      deactivateChildComponent(componentInstance, true /* direct */)
    }
  }
}
```

这里走deactivateChildComponent

## deactivateChildComponent

```js
export function deactivateChildComponent (vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = true
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true
    for (let i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i])
    }
    callHook(vm, 'deactivated')
  }
}
```

这里是重点，和activateChildComponent逻辑基本差不多，重点看`vm._inactive = true`，在activateChildComponent中这段代码的逻辑是``vm._inactive = false`，在destroy的时候标为true，这样在active的时候又会走activateChildComponent了。

# 总结

1. keep-alive相关的生命周期为activated和deactivated，分别在mounted和destroy的时候调用，其中mounted对于keep-alive来说只会调用一次，后续的使用只会调用activated和deactivated。