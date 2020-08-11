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

## create

create实际上就是enter

## enter

```js
// call leave callback now
if (isDef(el._leaveCb)) {
  el._leaveCb.cancelled = true
  el._leaveCb()
}
```

上一个动画未完成时调用enter，会设置` el._leaveCb.cancelled = true`，然后调用`_leaveCb`直接结束

```js
const data = resolveTransition(vnode.data.transition)
```

这里比较关键的是resolveTransition

### resolveTransition-start

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

#### autoCssTransition

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

### resolveTransition-end

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

如果是第一次渲染，并且没有配置appear prop，则不进行动画渲染