定义在`runtime-dom/src/index.ts`

# createApp

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
const app = ensureRenderer().createApp(...args)
```

## ensureRenderer-start

```js
function ensureRenderer() {
  return renderer || (renderer = createRenderer<Node, Element>(rendererOptions))
}
```

第一次调用的时候，`renderer`是`undefined`，所以会走`createRenderer`

## createRenderer

```js
/**
 * The createRenderer function accepts two generic arguments:
 * HostNode and HostElement, corresponding to Node and Element types in the
 * host environment. For example, for runtime-dom, HostNode would be the DOM
 * `Node` interface and HostElement would be the DOM `Element` interface.
 *
 * Custom renderers can pass in the platform specific types like this:
 *
 * ``` js
 * const { render, createApp } = createRenderer<Node, Element>({
 *   patchProp,
 *   ...nodeOps
 * })
 * ```
 */
export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options: RendererOptions<HostNode, HostElement>) {
  return baseCreateRenderer<HostNode, HostElement>(options)
}
```

这里的`createRenderer`是一个通用函数，最大的奥秘在于`options`，它的类型是`RendererOptions`

### RendererOptions

```js
export interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement
> {
  patchProp(
    el: HostElement,
    key: string,
    prevValue: any,
    nextValue: any,
    isSVG?: boolean,
    prevChildren?: VNode<HostNode, HostElement>[],
    parentComponent?: ComponentInternalInstance | null,
    parentSuspense?: SuspenseBoundary | null,
    unmountChildren?: UnmountChildrenFn
  ): void
  forcePatchProp?(el: HostElement, key: string): boolean
  insert(el: HostNode, parent: HostElement, anchor?: HostNode | null): void
  remove(el: HostNode): void
  createElement(
    type: string,
    isSVG?: boolean,
    isCustomizedBuiltIn?: string
  ): HostElement
  createText(text: string): HostNode
  createComment(text: string): HostNode
  setText(node: HostNode, text: string): void
  setElementText(node: HostElement, text: string): void
  parentNode(node: HostNode): HostElement | null
  nextSibling(node: HostNode): HostNode | null
  querySelector?(selector: string): HostElement | null
  setScopeId?(el: HostElement, id: string): void
  cloneNode?(node: HostNode): HostNode
  insertStaticContent?(
    content: string,
    parent: HostElement,
    anchor: HostNode | null,
    isSVG: boolean
  ): HostElement[]
}
```

这里可以看出来，`patchProp，forcePatchProp`之外，其他的都是Dom操作。这些方法在`createRenderer`的时候是被外部传入的，也就是说这些方法的实际上是能被覆写的，这体现出了`Vue3`本身的跨平台的特性

## baseCreateRenderer

先来看类型

```js
// overload 1: no hydration
function baseCreateRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options: RendererOptions<HostNode, HostElement>): Renderer<HostElement>

// overload 2: with hydration
function baseCreateRenderer(
  options: RendererOptions<Node, Element>,
  createHydrationFns: typeof createHydrationFunctions
): HydrationRenderer
```

支持两个参数`options,createHydrationFns`，`createHydrationFns`是给服务端渲染用的先不讨论，这里看第一种情况

`baseCreateRenderer`太长，有一堆定义，先跳过看最后一部分

```js
return {
  render,
  hydrate,
  createApp: createAppAPI(render, hydrate)
}
```

这里的`createApp`方法就是`ensureRenderer().createApp(...args)`这里调用的方法，最后会返回`app`，每次调用`createApp`相当于调用`createAppAPI`的返回值`createApp`，从而创建新的`app`实例返回，`app`的类型如下

### app

```js
export interface App<HostElement = any> {
  version: string
  config: AppConfig
  use(plugin: Plugin, ...options: any[]): this
  mixin(mixin: ComponentOptions): this
  component(name: string): Component | undefined
  component(name: string, component: Component): this
  directive(name: string): Directive | undefined
  directive(name: string, directive: Directive): this
  mount(
    rootContainer: HostElement | string,
    isHydrate?: boolean
  ): ComponentPublicInstance
  unmount(rootContainer: HostElement | string): void
  provide<T>(key: InjectionKey<T> | string, value: T): this

  // internal, but we need to expose these for the server-renderer and devtools
  _uid: number
  _component: ConcreteComponent
  _props: Data | null
  _container: HostElement | null
  _context: AppContext
}
```

## ensureRenderer-end

```js
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
```

这里对`mount`进行了重写，加入了部分针对`rootComponent`的特性

# 总结

1. `createApp`会创建一个新的`Vue`实例，在`create`的过程中会创建patch，render，update等等函数，最后在mount中调用render函数从而调用创建的众多函数

