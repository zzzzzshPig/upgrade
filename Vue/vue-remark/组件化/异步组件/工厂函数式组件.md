> 工厂函数式组件声明指的是注册组件时传入的是没有`cid`属性的function（因为这个function也有可能是Sub构造函数），具体使用方法如下。

```javascript
myComponent: function (reslove) {
  require(['./cccc.vue'], reslove)
}
```

> 这里会等待require完毕之后再`reslove`，类似于Promise的使用方法，那么对于异步组件的处理是怎么样的呢，在文件`vdom/createa-component.js`中的`createComponent`方法。

```javascript
if (isObject(Ctor)) {
  Ctor = baseCtor.extend(Ctor)
}

if (typeof Ctor !== 'function') {
  if (process.env.NODE_ENV !== 'production') {
    warn(`Invalid Component definition: ${String(Ctor)}`, context)
  }
  return
}
```

> 这里是function所以不会走。

```javascript
// async component
let asyncFactory
if (isUndef(Ctor.cid)) {
  asyncFactory = Ctor
  Ctor = resolveAsyncComponent(asyncFactory, baseCtor)
}
```

> 这里就是处理异步组件的逻辑了，因为我们传入的`Ctor`只是普通的function，所以正常情况下肯定是没有`cid`的，之后我们就会走入`resolveAsyncComponent`的逻辑，它定义在同文件夹中的`helpers/resolve-async-component.js`。

```javascript
export function resolveAsyncComponent (
  factory: Function,
  baseCtor: Class<Component>
)
```

> factory是function，`baseCtor`是`Vue`。

```javascript
if (isTrue(factory.error) && isDef(factory.errorComp)) {
  return factory.errorComp
}

if (isDef(factory.resolved)) {
  return factory.resolved
}

const owner = currentRenderingInstance
if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
  // already pending
  factory.owners.push(owner)
}

if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
  return factory.loadingComp
}
```

> 第二个if在异步组件中会用到，其他的几个if是高级组件会用到的。`currentRenderingInstance`指的是当前正在render中的实例。

```javascript
if (owner && !isDef(factory.owners))
```

> 会进入这一段逻辑。

```javascript
const owners = factory.owners = [owner]
let sync = true
let timerLoading = null
let timerTimeout = null

;(owner: any).$on('hook:destroyed', () => remove(owners, owner))
```

> sync标识同步，`timerLoading，timerTimeout`是给其他类型的组件用的，暂时不看。最后这个对destroyed进行监听，如果在组件未加载完成之前父组件被销毁掉了，这个组件就没必要加载了。

```javascript
const forceRender = (renderCompleted: boolean) => {
  xxx
}
```

> `forceRender`是最后组件加载完毕调用的，先不看。

```
const resolve = once((res: Object | Class<Component>) => {
  xxx
})

const reject = once(reason => {
  xxx
})

const res = factory(resolve, reject)

if (isObject(res)) {
  xxx
}

sync = false
// return in case resolved synchronously
return factory.loading
  ? factory.loadingComp
  : factory.resolved
```

> `resolve,reject`都是后续调用的，暂时不看。res是我们传入的function，这时候将我们在写function时候写的两个形参传入，然后会返回undefined（等待`resovle`）。后面这个判断是对`promise`组件进行判断的，暂时不看。最后`sync`标志为false，因为function中这些属性都没有，所以最后返回undefined。`resolve-async-component.js`执行完毕回到`create-component.js`中。

```javascript
if (Ctor === undefined) {
  // return a placeholder node for async component, which is rendered
  // as a comment node but preserves all the raw information for the node.
  // the information will be used for async server-rendering and hydration.
  return createAsyncPlaceholder(
    asyncFactory,
    data,
    context,
    children,
    tag
  )
}	
```

> 这里`Ctor`是undefined，会调用`createAsyncPlaceholder`，它定义在`resolve-async-component.js`。

```javascript
export function createAsyncPlaceholder (
  factory: Function,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag: ?string
): VNode {
  const node = createEmptyVNode()
  node.asyncFactory = factory
  node.asyncMeta = { data, context, children, tag }
  return node
}
```

> 就是简单的创建一个注释节点在`dom`中占个位置，然后将工产函数的一些值赋值给`vnode`。最后返回这个`vnode`。由于是一个注释节点，所以会在`html`中插入一个注释。

> 当组件加载完毕之后，我们会调用`resolve`，这resolve我们在前面的`resolveAsyncComponent`执行中被定义。

```javascript
const resolve = once((res: Object | Class<Component>) => {
  // cache resolved
  factory.resolved = ensureCtor(res, baseCtor)
  // invoke callbacks only if this is not a synchronous resolve
  // (async resolves are shimmed as synchronous during SSR)
  if (!sync) {
    forceRender(true)
  } else {
    owners.length = 0
  }
})
```

>  factory.resolved的值为`ensureCtor`函数的返回值，`ensureCtor`方法定义在本文件中。

```javascript
function ensureCtor (comp: any, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}
```

> 这个函数是对导入的值进行获取，因为导入方式有`AMD,CMD`等，所以需要判断一下。最后判断是否是对象是因为这里可以单纯的传一个options进来，这个时候就会创建一个Sub实例。最后返回实例，回到`resolve`中。

```javascript
// invoke callbacks only if this is not a synchronous resolve
// (async resolves are shimmed as synchronous during SSR)
if (!sync) {
  forceRender(true)
} else {
  owners.length = 0
}
```

> 这里sync是false，所以我们会走`forceRender`，那么什么时候是true呢，注释说`ssr render`时候会是true。我们看看`forceRender`，它定义在上面。

```javascript
const forceRender = (renderCompleted: boolean) => {
  for (let i = 0, l = owners.length; i < l; i++) {
    (owners[i]: any).$forceUpdate()
  }

  if (renderCompleted) {
    xxx
  }
}
```

> `renderCompleted`和本节基本无关暂时不看，重点看`$forceUpdate`，它定义在`instance/lifecycle.js`中

```javascript
Vue.prototype.$forceUpdate = function () {
  const vm: Component = this
  if (vm._watcher) {
    vm._watcher.update()
  }
}
```

> 这个其实很简单，就是调用了`_watcher.update`，具体的`update`流程暂时不看，最后会调用`update`函数走入`_render`方法调用`_createElement`。

```javascript
vnode = render.call(vm._renderProxy, vm.$createElement)
```

> `_createElement`定义在`vdom/create-element.js`

```javascript
if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
  // component
  vnode = createComponent(Ctor, data, context, children, tag)
}
```

> 最后又会进入到`createComponent`中。

```javascript
if (isUndef(Ctor.cid)) {
  asyncFactory = Ctor
  Ctor = resolveAsyncComponent(asyncFactory, baseCtor)
    
  xxx
}
```

> 因为还是没有`cid`所以会再次进入`resolveAsyncComponent`。

```javascript
if (isDef(factory.resolved)) {
  return factory.resolved
}
```

> 最后会返回Sub实例。

> 那么到这里工产函数式组件的执行过程就已经看完了，下面我们将看promise组件的生成过程。