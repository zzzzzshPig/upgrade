> mount分为beforeMount和mounted。

### beforeMount

> 每个组件的初始化流程都是在父级patch的时候执行的，我们看`vdom/patch.js`中的`createElm`方法。

```javascript
if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
  return
}
```

> 在这里我们会尝试创建一个component，该方法定义在本文件。

```javascript
if (isDef(i = i.hook) && isDef(i = i.init)) {
  i(vnode, false /* hydrating */)
}
```

> 这里我们会调用init方法，它定义在`vdom/create-component.js`中。

```javascript
child.$mount(hydrating ? vnode.elm : undefined, hydrating)
```

> 判断的是keep-alive逻辑不考虑，所以我们会执行$mount，我们来看mount，定义在`instance/lifecycle.js`。

```javascript
callHook(vm, 'beforeMount')
```

> 在一开始就调用的这个hook。



### mounted

> 我们知道，mountComponent方法最后的`callHook(vm, 'mounted')`会进行判断，而组件是不符合这个判断所以不会走，那么组件的mounted又是在哪里call的呢，我们回到`vdom/patch.js`。

> 我们知道，组件$mount完毕后也会走到patch，因为这是一个递归的过程，在patch函数的最后有这么一段代码。

```javascript
invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
```

> 我们进入看看，它定义在本文件。

```javascript
// delay insert hooks for component root nodes, invoke them after the
// element is really inserted
if (isTrue(initial) && isDef(vnode.parent)) {
  vnode.parent.data.pendingInsert = queue
} else {
  for (let i = 0; i < queue.length; ++i) {
    queue[i].data.hook.insert(queue[i])
  }
}
```

> 这一段代码的else只会在new Vue时候的patch才会走，因为只有它的initial才会是false，parent才会是undefined。下面这个for循环的意义就是调用insertedVnodeQueue中的组件的hook，insertedVnodeQueue中只会放入组件的vnode，调用的是insert的hook，它定义在`vdom/create-component.js`中，它是在installComponentHooks中被初始化的，之前看过这次就先跳过了。

```javascript
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
```

> 在这里就callHook(componentInstance, 'mounted')了。

> 在Vue中，mounted的调用顺序和patch的顺序是一致的也就是先子后父的顺序。

