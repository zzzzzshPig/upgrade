> 在开始之前，我们用以下代码作为初始化组件的过程。

```javascript
import App from './App.vue'

new Vue({
  render: h => h(App),
}).$mount('#app')
```

> 我们知道，这个h函数实际上就是`createElement`函数，`App`是一个`Vue`组件，来看`createElement`函数，它定义在`vdom/create-element.js`。

> 前面的众多代码我们之前看过，直接忽略。

```javascript
if (typeof tag === 'string') {xxx} else {  
    // direct component options / constructor  
    vnode = createComponent(tag, data, context, children)
}
```

> 这里的tag是`App`，直接就会进行`createComponent`，这四个参数分别是`App，undefined，Vue，undefined`。`createComponent`定义在`./create-component.js`

```javascript
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
)
```

> `Ctor`指的是`App`，data是undefined，context是`Vue`，children和tag都是undefined。

```javascript
const baseCtor = context.$options._base
```

> 这里的`context.$options._base`是在`global-api/index.js`中定义的，他的值是`VueConstructor`。

```javascript
Vue.options._base = Vue
```

> $options是通过`mergeOptions`之后得来的。

```javascript
if (isObject(Ctor)) {
  Ctor = baseCtor.extend(Ctor)
}
```

> 这里会调用`Vue.extend`方法，它定义在`global-api/extend.js`中。

```javascript
extendOptions = extendOptions || {}
const Super = this
const SuperId = Super.cid
const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
if (cachedCtors[SuperId]) {
  return cachedCtors[SuperId]
}
```

> `extendOptions`是`VueConstructor`，Super是`VueConstructor`，`SuperId`是全局唯一id，`cachedCtors`是用来缓存，目前它的值是{}。

```javascript
const name = extendOptions.name || Super.options.name
if (process.env.NODE_ENV !== 'production' && name) {
  validateComponentName(name)
}
```

> 用来检验组件名的

```javascript
const Sub = function VueComponent (options) {
  this._init(options)
}
Sub.prototype = Object.create(Super.prototype)
Sub.prototype.constructor = Sub
Sub.cid = cid++
Sub.options = mergeOptions(
  Super.options,
  extendOptions
)
Sub['super'] = Super

if (Sub.options.props) {
  initProps(Sub)
}
if (Sub.options.computed) {
  initComputed(Sub)
}

// allow further extension/mixin/plugin usage
Sub.extend = Super.extend
Sub.mixin = Super.mixin
Sub.use = Super.use

// create asset registers, so extended classes
// can have their private assets too.
ASSET_TYPES.forEach(function (type) {
  Sub[type] = Super[type]
})
// enable recursive self-lookup
if (name) {
  Sub.options.components[name] = Sub
}

// keep a reference to the super options at extension time.
// later at instantiation we can check if Super's options have
// been updated.
Sub.superOptions = Super.options
Sub.extendOptions = extendOptions
Sub.sealedOptions = extend({}, Sub.options)
```

> 这里定义了一个和**`Vue`构造函数**基本一样的一个构造函数，然后通过原型继承**`Vue`构造函数**并且将super指向父级，然后对Sub进行了一系列的初始化。ASSET_TYPES是全局指令component，directive，filter。

```javascript
// cache constructor
cachedCtors[SuperId] = Sub
return Sub
```

> 然后缓存Sub构造函数，最后返回Sub构造函数，回到`create-component.js`中，这个时候`Ctor`就变成了Sub。

```javascript
let asyncFactory
if (isUndef(Ctor.cid)) {
  asyncFactory = Ctor
  Ctor = resolveAsyncComponent(asyncFactory, baseCtor)
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
}
```

> 异步组件，以后会讲到，暂时不看。

```javascript
data = data || {}

// resolve constructor options in case global mixins are applied after
// component constructor creation
resolveConstructorOptions(Ctor)

// transform component v-model data into props & events
if (isDef(data.model)) {
  transformModel(Ctor.options, data)
}

// extract props
const propsData = extractPropsFromVNodeData(data, Ctor, tag)

// functional component
if (isTrue(Ctor.options.functional)) {
  return createFunctionalComponent(Ctor, propsData, data, context, children)
}

// extract listeners, since these needs to be treated as
// child component listeners instead of DOM listeners
const listeners = data.on
// replace with listeners with .native modifier
// so it gets processed during parent component patch.
data.on = data.nativeOn

if (isTrue(Ctor.options.abstract)) {
  // abstract components do not keep anything
  // other than props & listeners & slot

  // work around flow
  const slot = data.slot
  data = {}
  if (slot) {
    data.slot = slot
  }
}
```

> 这一部分不重要，大致上过一遍。首先对data进行处理，因为是undefined，所以此时data变成了{}，`resolveConstructorOptions`是对全局`mixins`的处理，讲到`mixins`的时候我们再看，然后是对`v-model`的处理，然后是`propsData`，然后是函数组件，然后就是对Event的处理，然后是对slot的处理。

```javascript
// install component management hooks onto the placeholder node
installComponentHooks(data)
```

> 这个我们看一下，定义在本文件下。

```javascript
function installComponentHooks (data: VNodeData) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    const existing = hooks[key]
    const toMerge = componentVNodeHooks[key]
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
    }
  }
}

// hooksToMerge
const hooksToMerge = Object.keys(componentVNodeHooks) // ['init', 'prepatch', 'insert', 'destory']
```

> hooks的值是{}，`hooksToMerge`是一些钩子Map的key，existing是undefined，`toMerge`是钩子函数（代码就不贴了），最后是如果自定义了钩子则调用它，如果重复则一起调用，否则就调用默认的。

```javascript
// return a placeholder vnode
const name = Ctor.options.name || tag
const vnode = new VNode(
  `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
  data, undefined, undefined, undefined, context,
  { Ctor, propsData, listeners, tag, children },
  asyncFactory
)

xxxx

return vnode
```

> 最后就返回一个`vnode`，这里比较特殊的是它是一个`component vnode`，所以传入了`componentOptions`，也就是`{ Ctor, propsData, listeners, tag, children }`，最后返回这个`vnode`。

> `createComponent`最后也是返回一个component类型的`vnode`，然后再在update的时候patch到页面中，那边下一节我们来看一下组件的patch是怎样的过程。