> destroy分为beforeDestroy和destroyed。

> destroy不区分Vue和component。

### beforeDestroy

> beforeDestroy在$destroy中被调用，它定义在`instance/lifecycle.js`中。

```javascript
const vm: Component = this
if (vm._isBeingDestroyed) {
  return
}
callHook(vm, 'beforeDestroy')
```

> 这里就很简单了，直接调用。



### destroyed

```javascript
vm._isBeingDestroyed = true
// remove self from parent
const parent = vm.$parent
if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
  remove(parent.$children, vm)
}
// teardown watchers
if (vm._watcher) {
  vm._watcher.teardown()
}
let i = vm._watchers.length
while (i--) {
  vm._watchers[i].teardown()
}
// remove reference from data ob
// frozen object may not have observer.
if (vm._data.__ob__) {
  vm._data.__ob__.vmCount--
}
// call the last hook...
vm._isDestroyed = true
// invoke destroy hooks on current rendered tree
vm.__patch__(vm._vnode, null)
// fire destroyed hook
callHook(vm, 'destroyed')
// turn off all instance listeners.
vm.$off()
// remove __vue__ reference
if (vm.$el) {
  vm.$el.__vue__ = null
}
// release circular reference (#6759)
if (vm.$vnode) {
  vm.$vnode.parent = null
}
```

> 在经过一系列的释放，解绑，清除等操作之后会调用callHook(vm, 'destroyed')。这些操作中我们看下`vm.__patch__(vm._vnode, null)`。

```javascript
if (isUndef(vnode)) {
  if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
  return
}
```

> 在patch函数的开头我们进行的这个判断就是对vue实例的一个销毁，当然它主要的作用还是递归销毁此组件下的所有的组件，invokeDestroyHook中可以看到，它定义在本文件。

```javascript
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
```

> 这里会对所有children进行遍历然后递归调用此方法，最后都会调用`i.destroy`方法，它定义在`vdom/create-component`中的componentVNodeHooks常量。

```javascript
const { componentInstance } = vnode
if (!componentInstance._isDestroyed) {
  if (!vnode.data.keepAlive) {
    componentInstance.$destroy()
  } else {
    deactivateChildComponent(componentInstance, true /* direct */)
  }
}
```

> 在这里会调用组件的$destroy方法，然后又走入开头的逻辑以此实现递归destroy。

> 在Vue中，destroyed的调用顺序和patch的顺序是一致的也就是先子后父的顺序。

