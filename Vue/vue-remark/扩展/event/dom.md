对于dom的事件绑定处理在patch中定义，因为vnode转dom的过程在patch中。入口在`vdom/patch.js`中的createElm函数中。

# createElm

```js
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  xxx
  xxx
  if (isDef(data)) {
      invokeCreateHooks(vnode, insertedVnodeQueue)
  }
  xxx
  xxx
}
```

入口就是invokeCreateHooks函数，这个函数的作用就是调用createHooks，createHooks插入dom元素的钩子函数，每个平台可能都不一样，所以这里抽象成了钩子函数，具体执行逻辑定义在各个平台中。

## invokeCreateHooks

```js
function invokeCreateHooks (vnode, insertedVnodeQueue) {
  for (let i = 0; i < cbs.create.length; ++i) {
    cbs.create[i](emptyNode, vnode)
  }
  i = vnode.data.hook // Reuse variable
  if (isDef(i)) {
    if (isDef(i.create)) i.create(emptyNode, vnode)
    if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
  }
}
```

这里先调用了cbs.create，cbs.create的定义是在patch初始化时候，也就是调用createPatchFunction。

## createPatchFunction

```js
export function createPatchFunction (backend) {
  let i, j
  const cbs = {}

  const { modules, nodeOps } = backend

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }
}
```

这段代码里重要的地方在于modules，它是在`platforms/web/runtime/patch.js`中被传入。

### modules

```js
import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })
```

modules来自于baseModules和platformModules，baseModules中没有create相关的暂时不看，看platformModules。

### platformModules

```js
import attrs from './attrs'
import klass from './class'
import events from './events'
import domProps from './dom-props'
import style from './style'
import transition from './transition'

export default [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
]
```

因为我们看的是event相关的，所以只看events的create。

#### events

```js
xxx

export default {
  create: updateDOMListeners,
  update: updateDOMListeners
}
```

这里的create和update都是updateDOMListeners。那么在invokeCreateHooks中执行的`cbs.create[i](emptyNode, vnode)`调用的都是updateDOMListeners。

##### updateDOMListeners

```js
function updateDOMListeners (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  // 两个vnode都没有定义事件的 直接返回
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  const on = vnode.data.on || {}
  const oldOn = oldVnode.data.on || {}
  target = vnode.elm
  normalizeEvents(on)
  updateListeners(on, oldOn, add, remove, createOnceHandler, vnode.context)
  target = undefined
}
```

在invokeCreateHooks中调用的时候，oldVnode是emptyNode，vnode是vnode。normalizeEvents的作用是对绑定的事件进行兼容性处理，相当于fix ie。重点在updateListeners。

##### updateListeners

```js
export function updateListeners (
  on: Object,
  oldOn: Object,
  add: Function,
  remove: Function,
  createOnceHandler: Function,
  vm: Component
) {
  let name, def, cur, old, event
  
  // 循环每一个事件
  for (name in on) {
    def = cur = on[name]
    old = oldOn[name]
    event = normalizeEvent(name)

    xxx
   
    else if (isUndef(old)) {
      // cur.fns 为undefined则表示 是第一次create
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm)
      }
      // once 跳过
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture)
      }
      
      add(event.name, cur, event.capture, event.passive, event.params)
    } else if (cur !== old) {
      // 更新状态
      old.fns = cur
      on[name] = old
    }
  }
  // remove Event
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name)
      remove(event.name, oldOn[name], event.capture)
    }
  }
}
```

因为我们是第一次create，所以肯定会走`else if (isUndef(old))`这一段逻辑，先调用`cur = on[name] = createFnInvoker(cur, vm)`，createFnInvoker返回一个新的函数，作用是对原有函数包装一层invokeWithErrorHandling进行错误捕捉。之后调用add方法进行事件的注册，相当于调用addEventListener。

最后的remove其实就是removeEventListener。

##### createFnInvoker

```js
export function createFnInvoker (fns: Function | Array<Function>, vm: ?Component): Function {
  function invoker () {
    const fns = invoker.fns
    if (Array.isArray(fns)) {
      const cloned = fns.slice()
      for (let i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments, vm, `v-on handler`)
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, `v-on handler`)
    }
  }
  invoker.fns = fns
  return invoker
}
```

返回一个新的函数，相当于是对fns进行了一层包装，对所有的事件都包装一层invokeWithErrorHandling，用于错误捕捉。这里还针对单个handler进行了优化，直接返回了包装函数，这样就少走了一部分逻辑，是一个内存和性能的双重优化。

##### add

add函数定义在events中

```js
function add (
  name: string,
  handler: Function,
  capture: boolean,
  passive: boolean
) {
  // async edge case #6566: inner click event triggers patch, event handler
  // attached to outer element during patch, and triggered again. This
  // happens because browsers fire microtask ticks between event propagation.
  // the solution is simple: we save the timestamp when a handler is attached,
  // and the handler would only fire if the event passed to it was fired
  // AFTER it was attached.
  if (useMicrotaskFix) {
    const attachedTimestamp = currentFlushTimestamp
    const original = handler
    handler = original._wrapper = function (e) {
      if (
        // no bubbling, should always fire.
        // this is just a safety net in case event.timeStamp is unreliable in
        // certain weird environments...
        e.target === e.currentTarget ||
        // event is fired after handler attachment
        e.timeStamp >= attachedTimestamp ||
        // bail for environments that have buggy event.timeStamp implementations
        // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
        // #9681 QtWebEngine event.timeStamp is negative value
        e.timeStamp <= 0 ||
        // #9448 bail if event is fired in another document in a multi-page
        // electron/nw.js app, since event.timeStamp will be using a different
        // starting reference
        e.target.ownerDocument !== document
      ) {
        return original.apply(this, arguments)
      }
    }
  }
  target.addEventListener(
    name,
    handler,
    supportsPassive
      ? { capture, passive }
      : capture
  )
}
```

这段逻辑不难，主要是针对fix的内容比较多，有好几个issue感兴趣的可以看一下。实际上add的作用就是最后一段代码的addEventListener，就是绑定事件的操作。

##### remove

```js
function remove (
  name: string,
  handler: Function,
  capture: boolean,
  _target?: HTMLElement
) {
  (_target || target).removeEventListener(
    name,
    handler._wrapper || handler,
    capture
  )
}
```

这里直接removeEventListener。

# update

update的入口在pathVnode中，patchVnode定义在`vdom/patch.js`。

## patchVnode

```js
function patchVnode (
  oldVnode,
  vnode,
  insertedVnodeQueue,
  ownerArray,
  index,
  removeOnly
) {
  xxx
  if (isDef(data) && isPatchable(vnode)) {
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
  }
  xxx
}
```

这里调用的update就是updateDOMListeners。

## updateDOMListeners

```js
export function updateListeners (
  on: Object,
  oldOn: Object,
  add: Function,
  remove: Function,
  createOnceHandler: Function,
  vm: Component
) {
  let name, def, cur, old, event
  for (name in on) {
    def = cur = on[name]
    old = oldOn[name]
    event = normalizeEvent(name)
    xxx
    else if (cur !== old) {
      old.fns = cur
      on[name] = old
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name)
      remove(event.name, oldOn[name], event.capture)
    }
  }
}
```

这里比较简单了，就是更新了fns的引用，然后调用invoke的时候的fns也会被更新，所以invoke的就是最新的fns。`on[name] = old`这一句的作用也是更新event的引用，这里说是old其实也是new。

# 总结

1. event中对于dom的处理逻辑还是比较简单的，重点还是在对于各个平台的抽象逻辑上，在这里vue是通过函数柯里化，传入不同的modules，然后对modules中不同的部分进行拆分，分配到hooks中，从而达到平台和开发上的解耦。
2. Vue 支持 2 种事件类型，原生 DOM 事件和自定义事件，它们主要的区别在于添加和删除事件的方式不一样，并且自定义事件的派发是往当前实例上派发，但是可以利用在父组件环境定义回调函数来实现父子组件的通讯。另外要注意一点，只有组件节点才可以添加自定义事件，并且添加原生 DOM 事件需要使用 `native` 修饰符；而普通元素使用 `.native` 修饰符是没有作用的，也只能添加原生 DOM 事件。