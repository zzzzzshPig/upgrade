> 本节我们重点关注`runtime+compiler`版本`Vue`的$mount实现，入口文件为 `entry-runtime-with-compiler.js`

```javascript
const mount = Vue.prototype.$mount
```

> 首先把`runtime\index.js`里声明的$mount保存，然后再覆写`Vue.prototype.$mount`，这里这么做是因为我们使用的是带`compiler`的版本，需要把`template`或者`render`编译成`render function`的，所以需要对`runtime-only`版本的`$mount`进行覆写。

```javascript
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component
```

> 参数只有两个，el是选择器，hydrating是和服务端渲染相关内容不做讨论。

```javascript
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }
```

> 这一处的代码是对el进行处理，获取到他对应的`dom`节点，并且这个节点不能是`body`或者`html`。

```javascript
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
```

> 这一段代码比较长，主要是对没有`render`函数的情况进行处理。如果`template`是带**#**的字符串，则当作选择器处理，获取对应`dom`的`innerHTML`，否则如果是`dom`则直接去`innerHTML`。如果没有`template`则获取`el`的`outerHTML`。因为`template`不是实体`dom`，只获取下面的第一个子节点，所以是使用`innerHTML`，而`el`是需要变成容器的`dom`，他本身也需要获取，所以使用`outerHTML`。最后将`template`转换为`render`函数。其他没有说明的代码大部分是和性能调试有关，这里不做讨论。

```javascript
return mount.call(this, el, hydrating)
```

> 最后调用之前保存的`mount`方法。

```javascript
// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

> 这里有一行注释，`public mount method` 公共的`mount`方法。这段代码对`el`进行了判断之后直接就只调用`mountComponent`。这个方法来自于`core/instance/lifecycle`，接下来我们看下这个方法。

```javascript
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component
```

> 这个方法有三个参数，`vm`是`Vue`实例，`el`是选择器，`hydrating`是和服务端渲染相关的不做讨论。

```javascript
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
```

> 这段代码是处理`render`函数的，因为我们之前处理过所以这里不会走，往下看。

```javascript
callHook(vm, 'beforeMount')
```

> 调用生命周期，因为是`mount`的一部分，所以才在`lifecycle.js`文件中？

```javascript
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

> 省略了一部分和性能调试相关代码。这里这个方法是用来`update render`的，属于`render`部分的知识，先跳过。

```javascript
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
```

> 这里是`new`了一个`renderWatcher`，进入`Watcher`

```javascript
  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  )
```

> `Watcher`是一个类，一步步来解析。先来解析`constructor`，`vm`是`Vue`实例，`expOrFn`是之前传进来的`updateComponent`函数，`cb`是回调函数，在这里是`noop`空函数，`options`是一些配置，`isRenderWatcher`是设置`renderWatcher`用的。

```javascript
this.vm = vm
if (isRenderWatcher) {
  vm._watcher = this
}
vm._watchers.push(this)
```

> 首先对`isRenderWatcher`进行了处理，后面的options相关的暂时不用看，跳过。

```javascript
if (typeof expOrFn === 'function') {
  this.getter = expOrFn
} else {
  this.getter = parsePath(expOrFn)
  if (!this.getter) {
    this.getter = noop
    process.env.NODE_ENV !== 'production' && warn(
      `Failed watching path: "${expOrFn}" ` +
      'Watcher only accepts simple dot-delimited paths. ' +
      'For full control, use a function instead.',
      vm
    )
  }
}
this.value = this.lazy
? undefined
: this.get()
```

> 这里将`updateComponent`设置为`getter`，然后执行`this.get`

```javascript
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
```

> 这里主要是收集依赖，然后再调用`getter`也就是之前的`updateComponent`获取到`value`，这里有点类似于`computed`，应该是当前`Vue`下的值发生了变化时候重新`render`。

```javascript
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
```

> `new Watcher`完毕之后又一次调用`mounted`生命周期。



> 基本上`mount`的逻辑是这样的，下一节我们看看`vm._update(vm._render(), hydrating)`的奥秘（应该是渲染`Vue`组件的）。

