# demo

```html
<template>
    <div id="app">
        <keep-alive>
            <helloWorld></helloWorld>
        </keep-alive>
    </div>
</template>
```

# 首次渲染

patch定义在`core/vdom/patch.js`

## patch

```js
if (isUndef(oldVnode)) {
  // empty mount (likely as component), create new root element
  isInitialPatch = true
  createElm(vnode, insertedVnodeQueue)
}
```

## createElm

```js
if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
  return
}
```

## createComponent

```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */)
    }
  }
}
```

### i.init-start

```js
 else {
  const child = vnode.componentInstance = createComponentInstanceForVnode(
    vnode,
    activeInstance
  )
}
```

之所以会走else是因为当前的vnode其实是helloWorld，还没有被实例化

#### createComponentInstanceForVnode-start

```js
export function createComponentInstanceForVnode (
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any, // activeInstance in lifecycle state
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  // check inline-template render functions
  const inlineTemplate = vnode.data.inlineTemplate
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render
    options.staticRenderFns = inlineTemplate.staticRenderFns
  }
  return new vnode.componentOptions.Ctor(options)
}
```

这里调用Sub构造函数创建组件，重复内容跳过。

#### createComponentInstanceForVnode-end

```js
child.$mount(hydrating ? vnode.elm : undefined, hydrating)
```

子组件内容patch过程，这里和keep-alive无关，直接跳过

### i.init-end

```js
// after calling the init hook, if the vnode is a child component
// it should've created a child instance and mounted it. the child
// component also has set the placeholder vnode's elm.
// in that case we can just return the element and be done.
if (isDef(vnode.componentInstance)) {
  initComponent(vnode, insertedVnodeQueue)
}
```

此时vnode.componentInstance已经有值了，因为子组件已经被实例化了

### initComponent-start

```js
if (isPatchable(vnode)) {
  invokeCreateHooks(vnode, insertedVnodeQueue)
  setScope(vnode)
}
```

### initComponent-end

初始化组件的属性，事件等

```js
insert(parentElm, vnode.elm, refElm)
if (isTrue(isReactivated)) {
  reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
}
return true
```

isReactivated是false所以不会调用reactivateComponent

# Update

组件在update的过程中会进入patchVnode的过程

## patchVnode

对于keep-alive来说，会执行到prepatch

```js
let i
const data = vnode.data
if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
  i(oldVnode, vnode)
}
```

### prepatch-start

```js
prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
  const options = vnode.componentOptions
  const child = vnode.componentInstance = oldVnode.componentInstance
  updateChildComponent(
    child,
    options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
  )
}
```

#### updateChildComponent

```js
// resolve slots + force update if has children
if (needsForceUpdate) {
  vm.$slots = resolveSlots(renderChildren, parentVnode.context)
  vm.$forceUpdate()
}
```

keep-alive是利用插槽的，所以这一步肯定会走

### prepatch-end

prepatch结束后，由于调用了$forceUpdate，所以会触发keep-alive组件重新渲染

### keep-alive: render

```js
if (cache[key]) {
  vnode.componentInstance = cache[key].componentInstance
  // make current key freshest
  remove(keys, key)
  keys.push(key)
}
```

在首次渲染的时候对组件进行过缓存，所以会进入到这一步拿取缓存的实例，拿到实例后又一次进入patch流程，进入createComponent

### createComponent

```js
const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
if (isDef(i = i.hook) && isDef(i = i.init)) {
  i(vnode, false /* hydrating */)
}
```

这时候isReactivated就是true了，之后调用init

#### i.init-start

```js
if (
  vnode.componentInstance &&
  !vnode.componentInstance._isDestroyed &&
  vnode.data.keepAlive
) {
  // kept-alive components, treat as a patch
  const mountedNode: any = vnode // work around flow
  componentVNodeHooks.prepatch(mountedNode, mountedNode)
}
```

此时他会进入子组件的prepatch流程，更新子组件的数据

#### i.init-end

```js
if (isDef(vnode.componentInstance)) {
  initComponent(vnode, insertedVnodeQueue)
  insert(parentElm, vnode.elm, refElm)
  if (isTrue(isReactivated)) {
    reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
  }
  return true
}
```

在initComponent中替换掉之前的elm之后进行insert，然后调用reactivateComponent

#### reactivateComponent

```js
function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  xxx
  // unlike a newly created component,
  // a reactivated keep-alive component doesn't insert itself
  insert(parentElm, vnode.elm, refElm)
}
```

省略部分是和transition相关的issure处理，暂时不看。这里会再次调用insert方法，插入dom，这里应该是多余的一步操作。



# 总结

1. 首次渲染和普通的组件渲染没什么区别，区别在于update的逻辑，在createComponent的时候不会再去创建这个组件，而是调用prepatch进行更新
2. keep-alive的组件更新和slot的更新一定程度上一致，本质上keep-alive组件也是利用了slot