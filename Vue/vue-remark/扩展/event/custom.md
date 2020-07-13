自定义事件只针对组件，所以对自定义事件的探索肯定是从初始化组件入手的。

# initInternalComponent

```js
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

定义在`instance/init.js`，这里将listeners赋值给`_parentListeners`，这个就是我们的自定义事件对象。初始化组件所需要的数据之后，会调用`initEvents`对事件进行初始化，`initEvents`定义在`instance/events.js`。

# initEvents

```js
export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
```

这里初始化了events相关属性后就直接调用了`updateComponentListeners`，将`listeners`传入，`updateComponentListeners`定义在`instance/events.js`。

## updateComponentListeners

```js
export function updateComponentListeners (
  vm: Component,
  listeners: Object,
  oldListeners: ?Object
) {
  target = vm
  updateListeners(listeners, oldListeners || {}, add, remove, createOnceHandler, vm)
  target = undefined
}
```

这里比较简单，因为是第一次创建`oldListeners`是空的所以是{}，add和remove分别对应$on和$off方法，`createOnceHandler`是创建once的方法。这里直接调用了`updateListeners`，定义在`vdom/helpers/update-listeners.js`。

## updateListeners

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
    
    else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm)
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture)
      }
      add(event.name, cur, event.capture, event.passive, event.params)
    } else if (cur !== old) {
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

这个在dom篇解析过，就不再赘述了，不一样的在于add和remove这两个方法，他们实际上是$on和$off方法。他们定义在eventsMixin中，这里分开了解$on,$once,$off,$emit。eventsMixin定义在`instance/event.js`。

### $on

```js
Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
  const vm: Component = this
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      vm.$on(event[i], fn)
    }
  } else {
    (vm._events[event] || (vm._events[event] = [])).push(fn)
    // optimize hook:event cost by using a boolean flag marked at registration
    // instead of a hash lookup
    if (hookRE.test(event)) {
      vm._hasHookEvent = true
    }
  }
  return vm
}
```

`Array.isArray(event)`这里对数组的情况进行了递归的$on。不是数组的情况先初始化`vm._events[event]`，然后添加回调函数，这里其实相当于一个订阅者的一个概念，订阅event事件，然后在触发的时候通知回调。这里的逻辑不难。

### $off

```js
Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
  const vm: Component = this
  // all
  if (!arguments.length) {
    vm._events = Object.create(null)
    return vm
  }
  // array of events
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      vm.$off(event[i], fn)
    }
    return vm
  }
  // specific event
  const cbs = vm._events[event]
  if (!cbs) {
    return vm
  }
  if (!fn) {
    vm._events[event] = null
    return vm
  }
  // specific handler
  let cb
  let i = cbs.length
  while (i--) {
    cb = cbs[i]
    if (cb === fn || cb.fn === fn) {
      cbs.splice(i, 1)
      break
    }
  }
  return vm
}
```

从all的那段逻辑就能看出，off的作用就是把事件从_event中delete掉，对于不同的情况有不同的方法，但最后的目的就是delete event。

### $once

```js
Vue.prototype.$once = function (event: string, fn: Function): Component {
  const vm: Component = this
  function on () {
    vm.$off(event, on)
    fn.apply(vm, arguments)
  }
  on.fn = fn
  vm.$on(event, on)
  return vm
}
```

once也不难，在on调用了之后就自动off掉event即可。

那么到这里事件注册就已经完成了，什么时候会被触发了，当事件内部调用了$emit的时候就会被触发。

### $emit

```js
Vue.prototype.$emit = function (event: string): Component {
  const vm: Component = this
  xxx
  let cbs = vm._events[event]
  if (cbs) {
    cbs = cbs.length > 1 ? toArray(cbs) : cbs
    const args = toArray(arguments, 1)
    const info = `event handler for "${event}"`
    for (let i = 0, l = cbs.length; i < l; i++) {
      invokeWithErrorHandling(cbs[i], vm, args, vm, info)
    }
  }
  return vm
}
```

这里就是取event name对应的事件，然后依次调用`invokeWithErrorHandling`。`invokeWithErrorHandling`就是包装了一层对错误进行捕捉。

# 总结

1. custom events其实是一套事件分发机制，其实就是event bus，通过事件注册，事件通知，事件销毁等生命周期来处理事件。
2. events的三个流程compiler, dom, custom都非常清晰，源码读起来也非常轻松，其中dom对于modules的把控非常值得借鉴，函数柯里化在vue3中会有大用。其次是custom event，它的事件派发逻辑很清脆，值得借鉴。