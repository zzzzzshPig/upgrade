> Vue的virtura dom是借鉴了开源库snabbdom的实现，然后加入了一些Vue特色的东西。本节的内容不是特别多，之后会重点研究snabbdom。先来看一下VNode这个庞大的Class把。定义在`vdom/vnode.js`。

```javascript
export default class VNode {
  tag: string | void; // div
  data: VNodeData | void; // attrs啥的
  children: ?Array<VNode>; // 子节点
  text: string | void; // 文本
  elm: Node | void; // 对应的真实节点
  ns: string | void; // 不清楚
  context: Component | void; // rendered in this component's scope
  key: string | number | void; // diff算法应该会用到
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
```

> 这里虽然属性比较多，但是我们重点了解的也就只有几个，在以后的学习的过程中我们会逐步了解。vNode的知识重点不在这，在于把vNode转化成实际dom上，这里涉及到的操作有create，diff，patch。那么对于想要了解vNode的朋友来说，可以参考上面提到的[snabbdom](https://github.com/snabbdom/snabbdom)。