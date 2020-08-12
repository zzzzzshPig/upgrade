入口文件在`platforms/web/runtime/components/transition.js`

# render

> 先看一下对于边界情况的处理

```js
let children: any = this.$slots.default
if (!children) {
  return
}
```

`<transition></transition>`这种情况

```js
// filter out text nodes (possible whitespaces)
children = children.filter(isNotTextNode)
/* istanbul ignore if */
if (!children.length) {
  return
}
```

这里的判断是限制子节点必须是一个dom节点或者是一个占位符(v-if)

```js
// warn multiple elements
if (process.env.NODE_ENV !== 'production' && children.length > 1) {
  warn(
    '<transition> can only be used on a single element. Use ' +
    '<transition-group> for lists.',
    this.$parent
  )
}
```

使用transition组件只能有一个子组件

```js
const mode: string = this.mode

// warn invalid mode
if (process.env.NODE_ENV !== 'production' &&
  mode && mode !== 'in-out' && mode !== 'out-in'
) {
  warn(
    'invalid <transition> mode: ' + mode,
    this.$parent
  )
}
```

mode只能是`in-out`或者`out-in`

```js
const rawChild: VNode = children[0]

// if this is a component root node and the component's
// parent container node also has transition, skip.
if (hasParentTransition(this.$vnode)) {
  return rawChild
}
```

如果祖先节点存在transition，跳过当前transition组件的渲染

```js
// apply transition data to child
// use getRealChild() to ignore abstract components e.g. keep-alive
const child: ?VNode = getRealChild(rawChild)
/* istanbul ignore if */
if (!child) {
  return rawChild
}
```

获取子组件中的非抽象组件，如`keep-alive`

```js
if (this._leaving) {
  return placeholder(h, rawChild)
}
```

对于keep-alive的特殊处理，暂时不看

> 再看一下逻辑处理部分

```js
const id: string = `__transition-${this._uid}-`
child.key = child.key == null
  ? child.isComment
    ? id + 'comment'
    : id + child.tag
  : isPrimitive(child.key)
    ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
    : child.key
```

设置key

```js
const data: Object = (child.data || (child.data = {})).transition = extractTransitionData(this)
const oldRawChild: VNode = this._vnode
const oldChild: VNode = getRealChild(oldRawChild)
```

初始化`child.data.transition`

## extractTransitionData-start

```js
export function extractTransitionData (comp: Component): Object {
  const data = {}
  const options: ComponentOptions = comp.$options
  // props
  for (const key in options.propsData) {
    data[key] = comp[key]
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  const listeners: ?Object = options._parentListeners
  for (const key in listeners) {
    data[camelize(key)] = listeners[key]
  }
  return data
}
```

这段代码的作用就是将传入的props和listeners赋值给data，最后返回data

## extractTransitionData-end

```js
// mark v-show
// so that the transition module can hand over the control to the directive
if (child.data.directives && child.data.directives.some(isVShowDirective)) {
  child.data.show = true
}

if (
  oldChild &&
  oldChild.data &&
  !isSameChild(child, oldChild) &&
  !isAsyncPlaceholder(oldChild) &&
  // #6687 component root is a comment node
  !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
) {
  // replace old child transition data with fresh one
  // important for dynamic transitions!
  const oldData: Object = oldChild.data.transition = extend({}, data)
  // handle transition mode
  if (mode === 'out-in') {
    // return placeholder node and queue update when leave finishes
    this._leaving = true
    mergeVNodeHook(oldData, 'afterLeave', () => {
      this._leaving = false
      this.$forceUpdate()
    })
    return placeholder(h, rawChild)
  } else if (mode === 'in-out') {
    if (isAsyncPlaceholder(child)) {
      return oldRawChild
    }
    let delayedLeave
    const performLeave = () => { delayedLeave() }
    mergeVNodeHook(data, 'afterEnter', performLeave)
    mergeVNodeHook(data, 'enterCancelled', performLeave)
    mergeVNodeHook(oldData, 'delayLeave', leave => { delayedLeave = leave })
  }
}

return rawChild
```

一些特殊情况的处理，先跳过

# transition-module

对于vnode的创建会调用cbs.create，具体逻辑不细述，这里会在vnode create完毕之后调用transition的`create`函数

## create & active

create实际上就是enter

### enter

```js
// call leave callback now
if (isDef(el._leaveCb)) {
  el._leaveCb.cancelled = true
  el._leaveCb()
}
```

上一个过渡未完成时调用enter，会设置` el._leaveCb.cancelled = true`，然后调用`_leaveCb`直接结束

```js
const data = resolveTransition(vnode.data.transition)
```

这里比较关键的是resolveTransition

#### resolveTransition-start

```js
export function resolveTransition (def?: string | Object): ?Object {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    const res = {}
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'))
    }
    extend(res, def)
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}
```

这里的作用其实就是设置过度class的名称

##### autoCssTransition

```js
const autoCssTransition: (name: string) => Object = cached(name => {
  return {
    enterClass: `${name}-enter`,
    enterToClass: `${name}-enter-to`,
    enterActiveClass: `${name}-enter-active`,
    leaveClass: `${name}-leave`,
    leaveToClass: `${name}-leave-to`,
    leaveActiveClass: `${name}-leave-active`
  }
})
```

#### resolveTransition-end

```js
if (isUndef(data)) {
  return
}
```

没有定义data则表示当前组件没有被transition包裹，直接返回

```js
/* istanbul ignore if */
if (isDef(el._enterCb) || el.nodeType !== 1) {
  return
}
```

`_enterCb`表示执行中再次执行enter，第二个是`el.nodeType !== 1`表示它不是一个普通的元素节点

```js
const {
  css,
  type,
  enterClass,
  enterToClass,
  enterActiveClass,
  appearClass,
  appearToClass,
  appearActiveClass,
  beforeEnter,
  enter,
  afterEnter,
  enterCancelled,
  beforeAppear,
  appear,
  afterAppear,
  appearCancelled,
  duration
} = data
```

取值

```js
// activeInstance will always be the <transition> component managing this
// transition. One edge case to check is when the <transition> is placed
// as the root node of a child component. In that case we need to check
// <transition>'s parent for appear check.
let context = activeInstance
let transitionNode = activeInstance.$vnode
while (transitionNode && transitionNode.parent) {
  context = transitionNode.context
  transitionNode = transitionNode.parent
}
```

这里是对transition是root node的情况进行处理，下面会用到，主要是对isAppear进行赋值

```js
const isAppear = !context._isMounted || !vnode.isRootInsert
```

transition如果是子组件的根节点，那么isAppear需要由其父级来判断

```js
if (isAppear && !appear && appear !== '') {
  return
}
```

如果是第一次渲染，并且没有配置appear prop，则不使用过渡效果

```js
const startClass = isAppear && appearClass
  ? appearClass
  : enterClass
const activeClass = isAppear && appearActiveClass
  ? appearActiveClass
  : enterActiveClass
const toClass = isAppear && appearToClass
  ? appearToClass
  : enterToClass
```

获取class，具体看transition的props https://cn.vuejs.org/v2/api/#transition

```js
const beforeEnterHook = isAppear
  ? (beforeAppear || beforeEnter)
  : beforeEnter
const enterHook = isAppear
  ? (typeof appear === 'function' ? appear : enter)
  : enter
const afterEnterHook = isAppear
  ? (afterAppear || afterEnter)
  : afterEnter
const enterCancelledHook = isAppear
  ? (appearCancelled || enterCancelled)
  : enterCancelled
```

获取自定义事件，具体看transition的自定义事件https://cn.vuejs.org/v2/api/#transition

```js
const explicitEnterDuration: any = toNumber(
  isObject(duration)
    ? duration.enter
    : duration
)

if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
  checkDuration(explicitEnterDuration, 'enter', vnode)
}
```

获取duration，校验duration

```js
const expectsCSS = css !== false && !isIE9
const userWantsControl = getHookArgumentsLength(enterHook)
```

expectsCSS用于是否显示过渡类，userWantsControl的作用是判断是否自动控制元素的显示隐藏逻辑，默认是自动添加和删除class

#### getHookArgumentsLength-start

```js
function getHookArgumentsLength (fn: Function): boolean {
  if (isUndef(fn)) {
    return false
  }
  const invokerFns = fn.fns
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}
```

判断enterHook的参数是否超过一个，第二个参数是(done)，超过一个则表示用户手动控制过渡的结束

#### getHookArgumentsLength-end

```js
const cb = el._enterCb = once(() => {
  if (expectsCSS) {
    removeTransitionClass(el, toClass)
    removeTransitionClass(el, activeClass)
  }
  if (cb.cancelled) {
    if (expectsCSS) {
      removeTransitionClass(el, startClass)
    }
    enterCancelledHook && enterCancelledHook(el)
  } else {
    afterEnterHook && afterEnterHook(el)
  }
  el._enterCb = null
})
```

定义enter结束后的回调函数，cancelled为true表示enter未结束，leave执行了

```js
if (!vnode.data.show) {
  // remove pending leave element on enter by injecting an insert hook
  mergeVNodeHook(vnode, 'insert', () => {
    const parent = el.parentNode
    const pendingNode = parent && parent._pending && parent._pending[vnode.key]
    if (pendingNode &&
      pendingNode.tag === vnode.tag &&
      pendingNode.elm._leaveCb
    ) {
      pendingNode.elm._leaveCb()
    }
    enterHook && enterHook(el, cb)
  })
}
```

调用enterHook，cb就是done

```js
// start enter transition
beforeEnterHook && beforeEnterHook(el)
if (expectsCSS) {
  addTransitionClass(el, startClass)
  addTransitionClass(el, activeClass)
  nextFrame(() => {
    removeTransitionClass(el, startClass)
    if (!cb.cancelled) {
      addTransitionClass(el, toClass)
      if (!userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration)
        } else {
          whenTransitionEnds(el, type, cb)
        }
      }
    }
  })
}
```

调用beforeEnterHook，如果使用css控制过渡，则添加class，这里是控制enter相关的class 的添加和删除。whenTransitionEnds是获取transition属性的持续时间用来结束enter状态

```js
if (vnode.data.show) {
  toggleDisplay && toggleDisplay()
  enterHook && enterHook(el, cb)
}
```

v-show相关，用来控制显示与隐藏

```js
if (!expectsCSS && !userWantsControl) {
  cb()
}
```

如果是纯js控制的话，调用enter

## remove

对于v-if控制的transition来说，remove调用的是leave

### leave

leave逻辑和enter差不多，大致上看一下

```js
const el: any = vnode.elm

// call enter callback now
if (isDef(el._enterCb)) {
  el._enterCb.cancelled = true
  el._enterCb()
}
```

leave的时候enter还未结束，调用_enterCb，结束enter状态

```js
const data = resolveTransition(vnode.data.transition)
  
if (isUndef(data) || el.nodeType !== 1) {
  return rm()
}

/* istanbul ignore if */
if (isDef(el._leaveCb)) {
  return
}
```

边界情况处理

```js
const {
  css,
  type,
  leaveClass,
  leaveToClass,
  leaveActiveClass,
  beforeLeave,
  leave,
  afterLeave,
  leaveCancelled,
  delayLeave,
  duration
} = data
```

用到的属性

```js
const expectsCSS = css !== false && !isIE9
const userWantsControl = getHookArgumentsLength(leave)

const explicitLeaveDuration: any = toNumber(
  isObject(duration)
    ? duration.leave
    : duration
)
```

是否css控制transition，是否手动控制过渡流程，获取过渡持续时间

```js
const cb = el._leaveCb = once(() => {
  if (el.parentNode && el.parentNode._pending) {
    el.parentNode._pending[vnode.key] = null
  }
  if (expectsCSS) {
    removeTransitionClass(el, leaveToClass)
    removeTransitionClass(el, leaveActiveClass)
  }
  if (cb.cancelled) {
    if (expectsCSS) {
      removeTransitionClass(el, leaveClass)
    }
    leaveCancelled && leaveCancelled(el)
  } else {
    rm()
    afterLeave && afterLeave(el)
  }
  el._leaveCb = null
})
```

leave完成的回调

```js
if (delayLeave) {
  delayLeave(performLeave)
} else {
  performLeave()
}
```

fix，见`platforms/web/runtime/components/transition.js`

```js
function performLeave () {
  // the delayed leave may have already been cancelled
  if (cb.cancelled) {
    return
  }
  // record leaving element
  if (!vnode.data.show && el.parentNode) {
    (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key: any)] = vnode
  }
  beforeLeave && beforeLeave(el)
  if (expectsCSS) {
    addTransitionClass(el, leaveClass)
    addTransitionClass(el, leaveActiveClass)
    nextFrame(() => {
      removeTransitionClass(el, leaveClass)
      if (!cb.cancelled) {
        addTransitionClass(el, leaveToClass)
        if (!userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration)
          } else {
            whenTransitionEnds(el, type, cb)
          }
        }
      }
    })
  }
  leave && leave(el, cb)
  if (!expectsCSS && !userWantsControl) {
    cb()
  }
}
```

leave效果控制流程



# 总结

1. transition的自动控制其实是控制class的添加和删除，手动控制其实是控制hooks的调用

