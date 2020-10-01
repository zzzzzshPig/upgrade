defineComponent的返回值在使用createApp时传入并被赋值在`_context.app._component`下，但是并没有使用。这一章节就来看一下options的属性都是怎么解析与使用的

# setup

setup的处理在render函数中

> runtime-core/src/renderer.ts

```js
const render: RootRenderFunction = (vnode, container) => {
  if (vnode == null) {
    if (container._vnode) {
      unmount(container._vnode, null, null, true)
    }
  } else {
    patch(container._vnode || null, vnode, container)
  }
  flushPostFlushCbs()
  container._vnode = vnode
}
```

这里走patch

## patch

只看相关代码

```js
switch (type) {
  case Text:
    // xxx
  case Comment:
    // xxx
  case Static:
    // xxx
  case Fragment:
    // xxx
  default:
  	// xxx
    else if (shapeFlag & ShapeFlags.COMPONENT) {
      processComponent(
        n1,
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        optimized
      )
    }
}
```

### processComponent

```js
if (n1 == null) {
  // xxx 
  else {
    mountComponent(
      n2,
      container,
      anchor,
      parentComponent,
      parentSuspense,
      isSVG,
      optimized
    )
  }
}
```

### mountComponent

```js
xxx
setupComponent(instance)
xxx
```

### setupComponent-start

```js
export function setupComponent(
  instance: ComponentInternalInstance,
  isSSR = false
) {
  isInSSRComponentSetup = isSSR

  const { props, children, shapeFlag } = instance.vnode
  const isStateful = shapeFlag & ShapeFlags.STATEFUL_COMPONENT
  initProps(instance, props, isStateful, isSSR)
  initSlots(instance, children)

  const setupResult = isStateful
    ? setupStatefulComponent(instance, isSSR)
    : undefined
  isInSSRComponentSetup = false
  return setupResult
}
```

isInSSRComponentSetup为false，`shapeFlag`是`ShapeFlags.STATEFUL_COMPONENT`，initProps和initSlots是对props和slots进行处理，这里的slots其实就是组件的children，具体代码先不讨论，继续往下看

```js
const setupResult = isStateful
  ? setupStatefulComponent(instance, isSSR)
  : undefined
```

### setupStatefulComponent-start

这里的逻辑就是处理setup函数的逻辑

```js
function setupStatefulComponent(
  instance: ComponentInternalInstance,
  isSSR: boolean
) {
  const Component = instance.type as ComponentOptions

  // __DEV__部分省略
  
  // 0. create render proxy property access cache
  instance.accessCache = {}
  // 1. create public instance / render proxy
  // also mark it raw so it's never observed
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers)
    
  // __DEV__部分省略
    
  // 2. call setup()
  const { setup } = Component
  if (setup) {
    const setupContext = (instance.setupContext =
      setup.length > 1 ? createSetupContext(instance) : null)

    currentInstance = instance
    pauseTracking() // setup作用域中调用响应式对象不会被track
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      ErrorCodes.SETUP_FUNCTION,
      // instance.props
      [__DEV__ ? shallowReadonly(instance.props) : instance.props, setupContext]
    )
    resetTracking()
    currentInstance = null

    if (isPromise(setupResult)) {
      if (isSSR) {
        // return the promise so server-renderer can wait on it
        return setupResult.then((resolvedResult: unknown) => {
          handleSetupResult(instance, resolvedResult, isSSR)
        })
      } else if (__FEATURE_SUSPENSE__) {
        // async setup returned Promise.
        // bail here and wait for re-entry.
        instance.asyncDep = setupResult
      }
      // __DEV__部分省略
    } else {
      handleSetupResult(instance, setupResult, isSSR)
    }
  } else {
    finishComponentSetup(instance, isSSR)
  }
}
```

这里重点看第二部，`call setup`，这里就是setup调用的地方。`callWithErrorHandling`调用setup拿到执行结果，这里执行结果不是promise所以跳过promise的逻辑，看`handleSetupResult`。这里会把`setupResult`转为响应式对象然后设置在`instance.setupState`，最后调用`finishComponentSetup`设置`instance.render`

### setupStatefulComponent-end

```js
setupRenderEffect(
  instance,
  initialVNode,
  container,
  anchor,
  parentSuspense,
  isSVG,
  optimized
)
```

这里就不细看了，作用相当于vue2.x中的`renderWatcher`

### setupComponent-end



# 总结

1. 对于defineComponent返回值的处理大部分是在render函数中，里面有对vue2.x的兼容
2. 对于setup函数，在执行期间会暂停`track`，相当于是一个小优化，setup的返回值会被设置为reactive对象，放到`instance.setupState`中