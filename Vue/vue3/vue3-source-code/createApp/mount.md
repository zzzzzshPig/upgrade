定义在`runtime-dom/src/index.ts`

# createApp中的mount

`createApp`返回的mount是基于`baseCreateRenderer`的mount进行修改的

```js
export const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args)

  if (__DEV__) {
    injectNativeTagCheck(app)
  }

  const { mount } = app
  app.mount = (containerOrSelector: Element | string): any => {
    const container = normalizeContainer(containerOrSelector)
    if (!container) return
    const component = app._component
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML
    }
    // clear content before mounting
    container.innerHTML = ''
    const proxy = mount(container)
    container.removeAttribute('v-cloak')
    container.setAttribute('data-v-app', '')
    return proxy
  }

  return app
}) as CreateAppFunction<Element>
```

```js
app.mount = (containerOrSelector: Element | string): any => {
  const container = normalizeContainer(containerOrSelector)
  if (!container) return
  const component = app._component
  if (!isFunction(component) && !component.render && !component.template) {
    component.template = container.innerHTML
  }
  // clear content before mounting
  container.innerHTML = ''
  const proxy = mount(container)
  container.removeAttribute('v-cloak')
  container.setAttribute('data-v-app', '')
  return proxy
}
```

首先获取到传入的`containerOrSelector`对应的`dom`

然后获取到对应的页面组件，在`createApp`中的`app._component`指的是调用`createApp`时候传入的参数

针对传入的component没有拿到对应的组件渲染方法，则会取`dom`的`innerHTML`

清空`dom`的`innerHTML`

调用`mount`

## mount-start

定义在`runtime-core/src/apiCreateApp.ts`

```js
mount(rootContainer: HostElement, isHydrate?: boolean): any {
  if (!isMounted) {
    const vnode = createVNode(
      rootComponent as ConcreteComponent,
      rootProps
    )
    // store app context on the root VNode.
    // this will be set on the root instance on initial mount.
    vnode.appContext = context

    // HMR root reload
    if (__DEV__) {
      context.reload = () => {
        render(cloneVNode(vnode), rootContainer)
      }
    }

    if (isHydrate && hydrate) {
      hydrate(vnode as VNode<Node, Element>, rootContainer as any)
    } else {
      render(vnode, rootContainer)
    }
    isMounted = true
    app._container = rootContainer
    // for devtools and telemetry
    ;(rootContainer as any).__vue_app__ = app

    if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
      devtoolsInitApp(app, version)
    }

    return vnode.component!.proxy
  } else if (__DEV__) {
    warn(
      `App has already been mounted.\n` +
        `If you want to remount the same app, move your app creation logic ` +
        `into a factory function and create fresh app instances for each ` +
        `mount - e.g. \`const createMyApp = () => createApp(App)\``
    )
  }
},
```

```js
const vnode = createVNode(
  rootComponent as ConcreteComponent,
  rootProps
)
```
将`rootComponent`转成`vnode`

```js
// store app context on the root VNode.
// this will be set on the root instance on initial mount.
vnode.appContext = context
```

将context储存，这个context是root级别的

```js
if (isHydrate && hydrate) {
  hydrate(vnode as VNode<Node, Element>, rootContainer as any)
} else {
  render(vnode, rootContainer)
}
```

这里会走`else`调用render生成并插入`dom`

```js
isMounted = true
app._container = rootContainer
// for devtools and telemetry
;(rootContainer as any).__vue_app__ = app
```

这里需要注意，`isMounted`实际上是内部变量，用于表示组件的渲染状态

`rootContainer`一般是`div#app`

设置的`__vue_app__`一般用于调试，将`vue`实例绑定到`dom`上

```js
return vnode.component!.proxy
```

返回组件对应的代理

## 返回值类型

返回值就是`vnode.component!.proxy`

```js
export type ComponentPublicInstance<
  P = {}, // props type extracted from props option
  B = {}, // raw bindings returned from setup()
  D = {}, // return from data()
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  E extends EmitsOptions = {},
  PublicProps = P,
  Options = ComponentOptionsBase<any, any, any, any, any, any, any, any>
> = {
  $: ComponentInternalInstance
  $data: D
  $props: P & PublicProps
  $attrs: Data
  $refs: Data
  $slots: Slots
  $root: ComponentPublicInstance | null
  $parent: ComponentPublicInstance | null
  $emit: EmitFn<E>
  $el: any
  $options: Options
  $forceUpdate: ReactiveEffect
  $nextTick: typeof nextTick
  $watch(
    source: string | Function,
    cb: Function,
    options?: WatchOptions
  ): WatchStopHandle
} & P &
  ShallowUnwrapRef<B> &
  D &
  ExtractComputedReturns<C> &
  M &
  ComponentCustomProperties
```

## mount-end

```js
container.removeAttribute('v-cloak')
container.setAttribute('data-v-app', '')
return proxy
```

代码中其他位置并无`set v-close`属性，所以应该是为了防止`root`设置`v-cloak`导致组件无法更新

设置`data-v-app`标识，代码中无特殊意义



# 总结

1. mount中最重要的有两个步骤，一个是`createVnode`，一个是render，第一个是组件对应的`vnode`，第二个是根据`vnode`进行`dom`的渲染，这里我们只了解过程不看具体代码，以后都会看的

