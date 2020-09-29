defineComponent的返回值在使用createApp时传入并被赋值在`_context.app._component`下，但是并没有使用。使用是在`app.mount`中的`createVNode`方法

定义在`runtime-core/src/apiCreateApp.ts`

下面的代码只关注和`rootComponent`有关的

# mount

```js
const vnode = createVNode(
  rootComponent as ConcreteComponent,
  rootProps
)
```

## createVNode

```js
export const createVNode = (__DEV__
  ? createVNodeWithArgsTransform
  : _createVNode) as typeof _createVNode
```

这里我们只讨论_createVNode

```js
if (!type || type === NULL_DYNAMIC_COMPONENT) {
  if (__DEV__ && !type) {
    warn(`Invalid vnode type when creating vnode: ${type}.`)
  }
  type = Comment
}
```

针对type异常进行处理

```js
if (isVNode(type)) {
  const cloned = cloneVNode(type, props)
  if (children) {
    normalizeChildren(cloned, children)
  }
  return cloned
}
```

在这里type不是vnode不会走这里

```js
// class component normalization.
if (isFunction(type) && '__vccOpts' in type) {
  type = type.__vccOpts
}
```

对`classComponent`进行处理

```js
// encode the vnode type information into a bitmap
const shapeFlag = isString(type)
  ? ShapeFlags.ELEMENT
  : __FEATURE_SUSPENSE__ && isSuspense(type)
    ? ShapeFlags.SUSPENSE
    : isTeleport(type)
      ? ShapeFlags.TELEPORT
      : isObject(type)
        ? ShapeFlags.STATEFUL_COMPONENT
        : isFunction(type)
          ? ShapeFlags.FUNCTIONAL_COMPONENT
          : 0
```

这里会取`ShapeFlags.STATEFUL_COMPONENT`

```js
if (__DEV__ && shapeFlag & ShapeFlags.STATEFUL_COMPONENT && isProxy(type)) {
  type = toRaw(type)
  warn(
    `Vue received a Component which was made a reactive object. This can ` +
      `lead to unnecessary performance overhead, and should be avoided by ` +
      `marking the component with \`markRaw\` or using \`shallowRef\` ` +
      `instead of \`ref\`.`,
    `\nComponent that was made reactive: `,
    type
  )
}
```

避免使用proxy组件造成不必要的性能浪费

```js
const vnode: VNode = {
  __v_isVNode: true,
  [ReactiveFlags.SKIP]: true,
  type,
  props,
  key: props && normalizeKey(props),
  ref: props && normalizeRef(props),
  scopeId: currentScopeId,
  children: null,
  component: null,
  suspense: null,
  dirs: null,
  transition: null,
  el: null,
  anchor: null,
  target: null,
  targetAnchor: null,
  staticCount: 0,
  shapeFlag,
  patchFlag,
  dynamicProps,
  dynamicChildren: null,
  appContext: null
}
```

创建vnode，type属性为传入的`rootComponent`

最后返回vnode

## render

在createVNode之后，紧接着就会调用render函数

```js
if (isHydrate && hydrate) {
  hydrate(vnode as VNode<Node, Element>, rootContainer as any)
} else {
  render(vnode, rootContainer)
}
```

不会SSR所以调用render，render是传入的参数，定义在`runtime-core/src/renderer.ts`

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

### patch

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
const instance: ComponentInternalInstance = (initialVNode.component = createComponentInstance(
  initialVNode,
  parentComponent,
  parentSuspense
))
```

initialVNode就是之前创建的vnode

> 注意: instance是一个私有变量

#### createComponentInstance-start

```js
const type = vnode.type as ConcreteComponent
// inherit parent app context - or - if root, adopt from root vnode
const appContext =
  (parent ? parent.appContext : vnode.appContext) || emptyAppContext

const instance: ComponentInternalInstance = {
  uid: uid++,
  vnode,
  type,
  parent,
  appContext,
  root: null!, // to be immediately set
  next: null,
  subTree: null!, // will be set synchronously right after creation
  update: null!, // will be set synchronously right after creation
  render: null,
  proxy: null,
  withProxy: null,
  effects: null,
  provides: parent ? parent.provides : Object.create(appContext.provides),
  accessCache: null!,
  renderCache: [],

  // local resovled assets
  components: null,
  directives: null,

  // resolved props and emits options
  propsOptions: normalizePropsOptions(type, appContext),
  emitsOptions: normalizeEmitsOptions(type, appContext),

  // emit
  emit: null as any, // to be set immediately
  emitted: null,

  // state
  ctx: EMPTY_OBJ,
  data: EMPTY_OBJ,
  props: EMPTY_OBJ,
  attrs: EMPTY_OBJ,
  slots: EMPTY_OBJ,
  refs: EMPTY_OBJ,
  setupState: EMPTY_OBJ,
  setupContext: null,

  // suspense related
  suspense,
  asyncDep: null,
  asyncResolved: false,

  // lifecycle hooks
  // not using enums here because it results in computed properties
  isMounted: false,
  isUnmounted: false,
  isDeactivated: false,
  bc: null,
  c: null,
  bm: null,
  m: null,
  bu: null,
  u: null,
  um: null,
  bum: null,
  da: null,
  a: null,
  rtg: null,
  rtc: null,
  ec: null
}
if (__DEV__) {
  instance.ctx = createRenderContext(instance)
} else {
  instance.ctx = { _: instance }
}
instance.root = parent ? parent.root : instance
instance.emit = emit.bind(null, instance)
```

type是rootComponent, vnode是createVNode创建的vnode

#### createComponentInstance-end

```js
setupComponent(instance)
```

#### setupComponent-start

```js
const { props, children, shapeFlag } = instance.vnode
const isStateful = shapeFlag & ShapeFlags.STATEFUL_COMPONENT
initProps(instance, props, isStateful, isSSR)
initSlots(instance, children)
```

`shapeFlag`是`ShapeFlags.STATEFUL_COMPONENT`，props和slots都没有

#### setupComponent-end

```js
const setupResult = isStateful
  ? setupStatefulComponent(instance, isSSR)
  : undefined
```

#### setupStatefulComponent-start

这里的逻辑就是处理setup函数的逻辑

```js
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
    [__DEV__ ? shallowReadonly(instance.props) : instance.props, setupContext]
  )
  resetTracking()
  currentInstance = null

  if (isPromise(setupResult)) {
    // xxx
  } else {
    handleSetupResult(instance, setupResult, isSSR)
  }
}
```

大致说一下，`callWithErrorHandling`调用setup函数拿到执行结果，这里执行结果不是promise暂时跳过promise的执行逻辑，走`handleSetupResult`，这里会把`setupResult`转为响应式对象然后设置在`instance.setupState`，最后调用`finishComponentSetup`设置`instance.render`

#### setupStatefulComponent-end

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

对render设置effect，相当于是vue2.x中的`renderWatcher`



# 总结

1. 对于defineComponent返回值的处理大部分是在render函数中，里面有对vue2.x的兼容
2. 对于setup函数，在执行期间会暂停`track`，相当于是一个小优化，setup的返回值会被设置为reactive对象，放到`instance.setupState`中
3. 对于render函数中处理defineComponent返回值的逻辑有了一个初始的认识，那么setup函数中执行的beforeMount等生命周期又是怎么处理的呢？下一节我们来了解以下这些内容