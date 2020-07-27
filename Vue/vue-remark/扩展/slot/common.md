

我们以这个demo为例子进行slot的讲解

```js
const slotComponent = {
    template: `
			<div class="content">
                <header>
                	<slot name="header">这是header slot</slot>
                </header>

                <main>
                	<slot>这是default slot</slot>
                </main>

                <footer>
                	<slot name="footer">这是footer slot</slot>
                </footer>
			</div>
	`
}

export default {
   name: 'App',
   components: {
      slotComponent
   },
   template: `
           <div id="app">
               <slotComponent>
                   <h1 slot="header">我是header</h1>
                   
                   <div>我是default</div>
                   
                   <div slot="footer">我是footer</div>
               </slotComponent>
           </div>
       `,
   data () {
      return {}
   }
}
```

# compiler

## parse

parse的入口在processSlotContent方法，定义在`compiler/parser/index.js`。

### parent

#### processSlotContent

```js
function processSlotContent (el) {
  // 在我们这个例子中 因为没有用到slot-scope 所以不需要看这段代码
  xxx

  // slot="xxx"
  const slotTarget = getBindingAttr(el, 'slot')
  if (slotTarget) {
    el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget
    el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot'])
    // preserve slot as an attribute for native shadow DOM compat
    // only for non-scoped slots.
    if (el.tag !== 'template' && !el.slotScope) {
      addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'))
    }
  }
  
  // 2.6.0之后的slot处理先跳过
  xxx
}
```

首先获取到slotTarget，也就是例子中的header，footer。注意，此时的编译还是在App中，也就是父级中。对于default来说（这里指的是省略没写的情况），是不会进if的，在之后会处理default。那么这里会生成如下代码

```js
el = {
	xxx
	slotTarget: '"header"',
	slotTargetDynamic: false,
	attrs: [
		xxx,
		{
			dynamic: undefined,
            end: 84,
            name: "slot",
            start: 71,
            value: ""header"",
		}
	]
}
```

这里父组件的处理就结束了，我们再看看子组件的slot处理。

### children

#### processSlotOutlet

```js
function processSlotOutlet (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name')
    if (process.env.NODE_ENV !== 'production' && el.key) {
      warn(
        `\`key\` does not work on <slot> because slots are abstract outlets ` +
        `and can possibly expand into multiple elements. ` +
        `Use the key on a wrapping element instead.`,
        getRawBindingAttr(el, 'key')
      )
    }
  }
}
```

这里比较简单，就是给el添加了一个slotName属性，最后生成了如下的代码

```js
{
    xxx
    slotName: ""header""
    tag: "slot"
}
```



## generate

generate的入口在genData函数，定义在`compiler/codegen/index.js`。

### parent

```js
export function genData (el: ASTElement, state: CodegenState): string {
  let data = '{'
  xxx
  
  if (el.attrs) {
    data += `attrs:${genProps(el.attrs)},`
  }

  xxx
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += `slot:${el.slotTarget},`
  }
  xxx
  return data
}
```

父组件就是简单的设置attrs和slot属性，最后生成如下代码

```js
"with(this){return _c('div',{attrs:{"id":"app"}},[_c('slotComponent',[_c('h1',{attrs:{"slot":"header"},slot:"header"},[_v("我是header")]),_v(" "),_c('div',[_v("我是default")]),_v(" "),_c('div',{attrs:{"slot":"footer"},slot:"footer"},[_v("我是footer")])])],1)}"
```

### children

#### genSlot

```js
function genSlot (el: ASTElement, state: CodegenState): string {
  const slotName = el.slotName || '"default"'
  const children = genChildren(el, state)
  let res = `_t(${slotName}${children ? `,${children}` : ''}`
  const attrs = el.attrs || el.dynamicAttrs
    ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(attr => ({
        // slot props are camelized
        name: camelize(attr.name),
        value: attr.value,
        dynamic: attr.dynamic
      })))
    : null
  const bind = el.attrsMap['v-bind']
  if ((attrs || bind) && !children) {
    res += `,null`
  }
  if (attrs) {
    res += `,${attrs}`
  }
  if (bind) {
    res += `${attrs ? '' : ',null'},${bind}`
  }
  return res + ')'
}
```

这里比较特殊的是使用的是_t方法，它对应到render中就是renderSlot方法，用来渲染slot的。其他也没有什么特殊的地方，最后子组件生成的代码如下

```js
"with(this){return _c('div',{staticClass:"content"},[_c('header',[_t("header",[_v("这是header slot")])],2),_v(" "),_c('main',[_t("default",[_v("这是default slot")])],2),_v(" "),_c('footer',[_t("footer",[_v("这是footer slot")])],2)])}"
```

## 总结

1. 编译部分的处理相对简单，在父级里就是多了几个属性，而在子级中则是使用不同的render方法去进行处理。

# runtime

runtime中对于slot的处理在render中，上节我们知道，slot被包裹在`_t`函数中，那么这个`_t`是什么呢，它定义在`core/instance/render-helpers/index.js`。

## render-helpers

```js
import { toNumber, toString, looseEqual, looseIndexOf } from 'shared/util'
import { createTextVNode, createEmptyVNode } from 'core/vdom/vnode'
import { renderList } from './render-list'
import { renderSlot } from './render-slot'
import { resolveFilter } from './resolve-filter'
import { checkKeyCodes } from './check-keycodes'
import { bindObjectProps } from './bind-object-props'
import { renderStatic, markOnce } from './render-static'
import { bindObjectListeners } from './bind-object-listeners'
import { resolveScopedSlots } from './resolve-scoped-slots'
import { bindDynamicKeys, prependModifier } from './bind-dynamic-keys'

export function installRenderHelpers (target: any) {
  target._o = markOnce
  target._n = toNumber
  target._s = toString
  target._l = renderList
  target._t = renderSlot
  target._q = looseEqual
  target._i = looseIndexOf
  target._m = renderStatic
  target._f = resolveFilter
  target._k = checkKeyCodes
  target._b = bindObjectProps
  target._v = createTextVNode
  target._e = createEmptyVNode
  target._u = resolveScopedSlots
  target._g = bindObjectListeners
  target._d = bindDynamicKeys
  target._p = prependModifier
}
```

可以看到，`_t`就是renderSlot方法。

## renderSlot - start

定义在`core/instance/render-helpers/render-slot.js`

```js
export function renderSlot (
  name: string,
  fallback: ?Array<VNode>,
  props: ?Object,
  bindObject: ?Object
): ?Array<VNode> {
  xxx
  nodes = this.$slots[name] || fallback
  xxx
}
```

这里需要先了解this.$slots（这里感觉不是很好，数据来源太不清晰了）。我们知道slot使用在组件内部，所以我们第一步要做的就是看patch过程中对于组件的处理，下面一系列逻辑过得比较快，注意看。

首先是patch中会调用createElm

### createElm

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

  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }

  xxx
}
```

createElm会调用createComponent，因为slot在component中，所以这里执行完毕之后会return，也就是说组件内部的slot在这期间会处理。

### createComponent

```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */)
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

这里先调用i.init，定义在`core/vom/create-component.js`。

### componentVNodeHooks.init

```js
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
}
```

keepAlive的处理我们不看，这里又调用了createComponentInstanceForVnode。

### createComponentInstanceForVnode

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

这里我们只看最后一段`new vnode.componentOptions.Ctor(options)`，Ctor我们之前已经知道了，实际上是Sub。

### Sub

```js
const Sub = function VueComponent (options) {
  this._init(options)
}
```

这里就是实例化一个Vue组件实例。

### Vue.prototype._init

```js
Vue.prototype._init = function (options?: Object) {
  xxx
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options)
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }
  xxx
  initRender(vm)
  xxx
}
```

因为是组件，所以会调用initInternalComponent。

### initInternalComponent

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

这里我们只看`_renderChildren`方法，它实际上是`parentVnode.componentOptions.children`，parentVnode实际上是父组件下的当前组件的vnode，它的children实际上就是slot了。这个`_renderChildren`我们后续会用到，继续向下看initRender。

### initRender

重点来了，在renderSlot中我们想知道的this.$scopedSlots和this.$slots就是这里来的

```js
export function initRender (vm: Component) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject
  xxx
}
```

首先是`vm.$slots = resolveSlots(options._renderChildren, renderContext)`中的`_renderChildren`和renderContext，`_renderChildren`就是前面说过的。renderContext是父组件，接下来看resolveSlots。

### resolveSlots

```js
export function resolveSlots (
  children: ?Array<VNode>,
  context: ?Component
): { [key: string]: Array<VNode> } {
  // 没有children，$slot = {}
  if (!children || !children.length) {
    return {}
  }
  const slots = {}
  for (let i = 0, l = children.length; i < l; i++) {
    const child = children[i]
    const data = child.data
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    // 对于有slot属性的slot进行处理
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      const name = data.slot // "header"
      const slot = (slots[name] || (slots[name] = [])) // {"header": []}
      // 跳过template
      if (child.tag === 'template') {
        // template下可能没有child，slot中无vnode
        slot.push.apply(slot, child.children || [])
      } else {
        // 添加vnode
        slot.push(child)
      }
    } else {
      // 对default情况进行处理，直接添加
      (slots.default || (slots.default = [])).push(child)
    }
  }
  // ignore slots that contains only whitespace
  for (const name in slots) {
    // isWhitespace函数的返回值 return (node.isComment && !node.asyncFactory) || node.text === ' '
    if (slots[name].every(isWhitespace)) {
      delete slots[name]
    }
  }
  // {"header": [vnode], xxx}
  return slots
}
```

resolveSlots就是对vnode.slot进行一次遍历初始化值然后返回，最后返回的代码如下

```js
{
  "header": [vnode],
  "default": [vnode],
  "footer": [vnode]
}
```

那么到这里，我们的组件的初始化工作就完成了，接下来就是等待_render的执行调用renderSlot 了。

## renderSlot - end

```javascript
export function renderSlot (
  name: string,
  fallback: ?Array<VNode>,
  props: ?Object,
  bindObject: ?Object
): ?Array<VNode> {
  // scopedSlot逻辑先跳过
  xxx
  else {
    nodes = this.$slots[name] || fallback
  }

  const target = props && props.slot
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}
```

fallback是`[_v("这是default slot")]`，其实就是子组件内部slot的默认值，最后调用this.$createElement创建真实dom，需要注意的是，this.$slots中的[vode]其实是父组件下面的vnode，所以渲染用到的数据也是父组件的。

## 总结

1. 对于slot最终是怎么创建出dom的过程比较复杂，但是主要思路还是可以看出来的。获取父组件下对应的组件中的children当作slot，然后在子组件渲染的时候渲染这些children即可，也就是说，渲染的过程在子组件上，用到的数据在父组件中。



