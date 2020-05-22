> 前置条件如下。

```javascript
new Vue({
  render: h => h(App),
}).$mount('#app')
```

> `App.vue`

```html
<template>
  <div id="app">
    {{text}}
  </div>
</template>
```

> 这里我们渲染的是一个`App`组件，我们从`vdom/patch.js`开始，

```javascript
createElm(
  vnode,
  insertedVnodeQueue,
  // extremely rare edge case: do not insert if old element is in a
  // leaving transition. Only happens when combining transition +
  // keep-alive + HOCs. (#4590)
  oldElm._leaveCb ? null : parentElm,
  nodeOps.nextSibling(oldElm)
)
```

> 前面的一堆代码是无关紧要的，从这里开始，`vnode`就是我们`App`的`vnode`了。

```javascript
if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
  return
}
```

> 其他的代码不用看，这里是和组件相关的部分了。`vnode, insertedVnodeQueue, parentElm, refElm`分别是`App`的`vnode`，[]，`body`，text。

```javascript
let i = vnode.data
```

> 这个`vnode.data`的值在`vdom/create-component.js`中的`installComponentHooks`被定义。

```javascript
const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
```

> `keepAlive`逻辑暂时忽略。

```javascript
if (isDef(i = i.hook) && isDef(i = i.init)) {
  i(vnode, false /* hydrating */)
}
```

> 这一段代码会调用`init`函数，我们来看看，它定义在`vdom/create-component.js`。

```javascript
init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
  if (
    vnode.componentInstance &&
    !vnode.componentInstance._isDestroyed &&
    vnode.data.keepAlive
  ) {
    // kept-alive components, treat as a patch
    const mountedNode: any = vnode // work around flow
    componentVNodeHooks.prepatch(mountedNode, mountedNode)
  } else {
    const child = vnode.componentInstance = createComponentInstanceForVnode(
      vnode,
      activeInstance
    )
    child.$mount(hydrating ? vnode.elm : undefined, hydrating)
  }
},
```

> `vode`就是`App`，`vnode.componentInstance`没有所以走`createComponentInstanceForVnode`，这里的`activeInstance`就是我们在`_update`的时候`setActiveInstance`的`vm`也就是`App`对应的`Vue`实例，下面我们来看`createComponentInstanceForVnode`，它定义在本文件下。

```javascript
return new vnode.componentOptions.Ctor(options)
```

> 上面的其他逻辑基本可以不看，这个`vnode.componentOptions.Ctor`实际上是我们在`createComponent`中定义的`Sub`函数。

```javascript
const Sub = function VueComponent (options) {
  this._init(options)
}
```

> 这个`_init`方法就是`Vue.prototype._init`，我们只看与component相关的部分。

```javascript
const vm: Component = this
```

> `vm`是Sub实例。

```javascript
if (options && options._isComponent) {
  // optimize internal component instantiation
  // since dynamic options merging is pretty slow, and none of the
  // internal component options needs special treatment.
  initInternalComponent(vm, options)
}
```

> 这里会走`initInternalComponent`。

```javascript
export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
```

> `parentVnode`是`App`，`componentOptions`是`new Vnode`的时候传入的。其他都是一些赋值操作，跳过，我们继续往下看。

```javascript
initLifecycle(vm)
```

> 这个函数定义在`instance/lifecycle.js`。

```javascript
const options = vm.$options

// locate first non-abstract parent
let parent = options.parent
if (parent && !options.abstract) {
  while (parent.$options.abstract && parent.$parent) {
    parent = parent.$parent
  }
  parent.$children.push(vm)
}

vm.$parent = parent
```

> 这段代码是建立起了组件和组件之间的父子关系，`options.abstract`不存在所以while不会走，`parent.$children.push(vm)`这段代码就将`vm`实例放入到父组件当中了，然后指定父级`vm.$parent = parent`，回到`init`中。

> 后面的代码没有什么特殊的，我们回到`create-component.js`中

```javascript
return new vnode.componentOptions.Ctor(options)
```

> 这段代码返回了组件的`vm`实例，继续回到上一级。

```javascript
child.$mount(hydrating ? vnode.elm : undefined, hydrating)
```

> 最后调用了`$mount`方法，参数是undefined和false，这个方法定义在`platforms/runtime/index.js`。

```javascript
el = el && inBrowser ? query(el) : undefined
return mountComponent(this, el, hydrating)
```

> el是undefined，调用`mountComponent`，定义在`instance/lifecycle.js`。

```javascript
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

> 然后走`_render`，`_update`，我们来看一下`render`，定义在`instance/render.js`。

```
const vm: Component = this
const { render, _parentVnode } = vm.$options
```

> `vm`是`App`的组件实例，`_parentVnode`是`App`的`vnode`。

```javascript
vnode = render.call(vm._renderProxy, vm.$createElement)
```

> render生成了`App`中的`dom`的`vnode`。

```javascript
vnode.parent = _parentVnode
return vnode
```

> 最后`App`的子`vnode`的父级设置为`App`的`vnode`，返回了子`vnode`，回到`_update`处，进入`_update`方法。

```javascript
const vm: Component = this
const prevEl = vm.$el
const prevVnode = vm._vnode
const restoreActiveInstance = setActiveInstance(vm)
```

> 此时的`vm`还是`App`，`prevEl`是undefined，`prevVnode`是null还没有，`setActiveInstance`之后的`activeInstance`就是`App`了，`prevActiveInstance`就是根`Vue`了，如果`App`中还有组件的话，那么子组件`_update`的时候，`activeInstance`就是子组件的`vm`，`prevActiveInstance`就是`App`了。这其实是一个深度遍历的过程，每一次遍历都能通过`activeInstance`取得父实例。

```javascript
vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
```

> 接下来又进入patch过程，定义在`vdom/patch.js`。

```javascript
if (isUndef(oldVnode)) {
  // empty mount (likely as component), create new root element
  isInitialPatch = true
  createElm(vnode, insertedVnodeQueue)
}
```

> 这一次`oldVnode`是undefined，所以会走入上面的逻辑，调用`createElm`。

```javascript
if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
  return
}
```

> 这时候又回到了我们的起点，在我们开始定义的例子中，`App.vue`是没有引用其他组件的，所以不会继续`createComponent`了，这里会返回`false`。

> 后面的逻辑我们之前走过了，现在回到`createComponent`函数，我们在`i.init`执行完毕之后还有一个逻辑。

```javascript
if (isDef(vnode.componentInstance)) {
  initComponent(vnode, insertedVnodeQueue)
  insert(parentElm, vnode.elm, refElm)
  if (isTrue(isReactivated)) {
    reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
  }
  return true
}
```

> 这里会执行`initComponent`，它定义在本文件中。

```javascript
if (isDef(vnode.data.pendingInsert)) {
  insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert)
  vnode.data.pendingInsert = null
}
vnode.elm = vnode.componentInstance.$el
if (isPatchable(vnode)) {
  invokeCreateHooks(vnode, insertedVnodeQueue)
  setScope(vnode)
} else {
  // empty component root.
  // skip all element-related modules except for ref (#3455)
  registerRef(vnode)
  // make sure to invoke the insert hook
  insertedVnodeQueue.push(vnode)
}
```

> 这段代码我们只看`vnode.elm = vnode.componentInstance.$el`，这里我们`vnode.elm`进行了赋值，现在跳出这个函数。

```javascript
insert(parentElm, vnode.elm, refElm)
```

> 然后在这里我们对节点进行了插入，由于的深度遍历，递归执行，所以我们最先插入的节点是子节点，然后层层回溯到最顶层的body中（也有可能不是body，这个要看你的根节点是定义在哪里了）。

> 好，现在组件的patch我们也过了一边，接下来就看看组件的其他内容了。