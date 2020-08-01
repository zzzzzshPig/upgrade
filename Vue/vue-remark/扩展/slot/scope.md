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
                	<slot text="footer"  name="footer">这是 footer slot</slot>
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
                    
                    <div slot="footer" slot-scope="props">我是{{props.text}}</div>
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

上一节讲普通slot的compiler的时候提到过scopedSlots，这里就直接说了，parse阶段的处理在processSlotContent中。

### processSlotContent

先来看对template的处理，虽然我们的demo并没有使用template，但是对于最后的值是一致的。

```js
if (el.tag === 'template') {
  slotScope = getAndRemoveAttr(el, 'scope')
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && slotScope) {
    warn(
      `the "scope" attribute for scoped slots have been deprecated and ` +
      `replaced by "slot-scope" since 2.5. The new "slot-scope" attribute ` +
      `can also be used on plain elements in addition to <template> to ` +
      `denote scoped slots.`,
      el.rawAttrsMap['scope'],
      true
    )
  }
  el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope')
}
```

除了最后一段代码`el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope')`，前面的都是对`vue2.5`版本之前的写法的兼容处理。最后一段的作用是获取scope对应的值，由于demo中并没有使用template，所以这里不会走。

```js
else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && el.attrsMap['v-for']) {
    warn(
      `Ambiguous combined usage of slot-scope and v-for on <${el.tag}> ` +
      `(v-for takes higher priority). Use a wrapper <template> for the ` +
      `scoped slot to make it clearer.`,
      el.rawAttrsMap['slot-scope'],
      true
    )
  }
  el.slotScope = slotScope
}
```

这里的处理对应到我们的demo，也就是`<div slot="footer" slot-scope="props">我是{{props.text}}</div>`。`el.slotScope = slotScope`除了这段代码，剩下的就是提示了，主要是说v-for和slot-scope不能一起使用，如果要用请使用template标签。那么最后一段代码的作用和template处理情况是一样的，赋值`el.slotScope`。对应到我们的demo，slotScope的值为props，那么对于processSlotContent的处理就是这样了，接下来的处理在closeElement中。

### closeElement

```js
if (element.slotScope) {
  // scoped slot
  // keep it in the children list so that v-else(-if) conditions can
  // find it as the prev node.
  const name = element.slotTarget || '"default"'
  ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element
}
```

name是footer，currentParent是slotComponent组件，这段代码是给父组件添加scopedSlots属性，添加完后的值大致上是这样的

```js
{
	scopedSlots: {
		footer: element
	}	
}
```

对于demo中的`<slot text="footer"  name="footer">这是 footer slot</slot>`这段代码没有什么特殊的地方，text当作attr解析了。接下来就是generate阶段了。

## generate

generate阶段对scopedSlots进行了处理，在genData函数中

### genData

```js
if (el.scopedSlots) {
  data += `${genScopedSlots(el, el.scopedSlots, state)},`
}
```

### genScopedSlots - start

needsForceUpdate和demo无关不用看。

```js
const generatedSlots = Object.keys(slots)
  .map(key => genScopedSlot(slots[key], state))
  .join(',')
```

这里先会调用genScopedSlot

#### genScopedSlot

```js
function genScopedSlot (
  el: ASTElement,
  state: CodegenState
): string {
  const isLegacySyntax = el.attrsMap['slot-scope']
  // if 和 for的逻辑跳过
  xxx
  // props
  const slotScope = el.slotScope === emptySlotScopeToken
    ? ``
    : String(el.slotScope)
  const fn = `function(${slotScope}){` +
    `return ${el.tag === 'template'
      ? el.if && isLegacySyntax
        ? `(${el.if})?${genChildren(el, state) || 'undefined'}:undefined`
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)
    }}`
  // reverse proxy v-slot without scope on this.$slots
  const reverseProxy = slotScope ? `` : `,proxy:true`
  return `{key:${el.slotTarget || `"default"`},fn:${fn}${reverseProxy}}`
}
```

这段代码最后会返回

```js
{
	key: "footer",
	fn: function(props){
    return _c('div',{},[_v("我是"+_s(props.text))])
  }
}
```

### genScopedSlots - end

```js
return `scopedSlots:_u([${generatedSlots}]${
  needsForceUpdate ? `,null,true` : ``
}${
  !needsForceUpdate && needsKey ? `,null,false,${hash(generatedSlots)}` : ``
})`
```

这里会返回字符串

```js
scopedSlots:_u([{
	key: "footer",
	fn: function(props){
    return _c('div',{},[_v("我是"+_s(props.text))])
  }
}])
```

需要注意的是，这里使用的是_u，对应的render方法是resolveScopedSlots，详细的在runtime中再讲，这里只需要了解即可。这里对于父级的scopedSlots就处理完毕了，那么在子组件中的slot有什么不一样的呢，处理方法在genSlot中。

### genSlot

```js
function genSlot (el: ASTElement, state: CodegenState): string {
  xxx
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

和普通slot的区别是多了一个attrs，因为el.attrs是存在的，所以这里会调用genProps，最后返回下面这段

```js
"{"text":"footer"}"
```

最后res返回

```js
"_t("footer",[_v("这是 footer slot")],{"text":"footer"})"
```

## 总结

1. 对于父组件来说，在parse阶段scopedSlots挂载到了父级中，父级在generate阶段会新增scopedSlots属性，调用_u方法创建scopedSlots。
2. 对于子组件来说，parse阶段无特别的内容，在generate阶段会对attrs进行处理，处理后的值当作_t的第三个参数传入，也就是props。

# runtime

先来看父级的scopedSlots

```js
scopedSlots:_u([{
	key: "footer",
	fn: function(props){
    return _c('div',{},[_v("我是"+_s(props.text))])
  }
}])
```

_u对应的render方法是resolveScopedSlots

## resolveScopedSlots

```js
export function resolveScopedSlots (
  fns: ScopedSlotsData, // see flow/vnode
  res?: Object,
  // the following are added in 2.6
  hasDynamicKeys?: boolean,
  contentHashKey?: number
): { [key: string]: Function, $stable: boolean } {
  res = res || { $stable: !hasDynamicKeys }
  for (let i = 0; i < fns.length; i++) {
    const slot = fns[i]
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys)
    } else if (slot) {
      xxx
      res[slot.key] = slot.fn
    }
  }
  if (contentHashKey) {
    (res: any).$key = contentHashKey
  }
  return res
}
```

这里，res，hasDynamicKeys，contentHashKey都是没有传的，`res = {$stable: true}`。slot是Array不是Array最后也都是调用resolveScopedSlots，Array的情况会递归调用，最后还是单个slot，所以这里只需要看else的情况。if(contentHashKey)`也是false不需要看，所以最后的返回值如下

```js
{
	footer: function(props){
    return _c('div',{},[_v("我是"+_s(props.text))])
  }
}
```

那么这里对于_u的处理就完毕了，scopedSlots的值是

```js
scopedSlots: {
	footer: function(props){
    return _c('div',{},[_v("我是"+_s(props.text))])
  }
}
```

接下来是对于子组件的处理，common章节讲到过，这里直接看renderSlot

## renderSlot-start

```js
export function renderSlot (
  name: string,
  fallback: ?Array<VNode>,
  props: ?Object,
  bindObject: ?Object
): ?Array<VNode> {
  const scopedSlotFn = this.$scopedSlots[name]
  xxx
}
```

这里我们需要先了解this.$scopedSlots从哪里来，定义在`core/instance/render.js`。

### Vue.prototype._render

```js
const vm: Component = this
const { render, _parentVnode } = vm.$options

if (_parentVnode) {
  vm.$scopedSlots = normalizeScopedSlots(
    _parentVnode.data.scopedSlots,
    vm.$slots,
    vm.$scopedSlots
  )
}
```

这里我们看一下normalizeScopedSlots方法

### normalizeScopedSlots-start

```js
res = {}
for (const key in slots) {
  if (slots[key] && key[0] !== '$') {
    res[key] = normalizeScopedSlot(normalSlots, key, slots[key])
  }
}
```

首先对scopedSlots进行处理，`res[key] = normalizeScopedSlot(normalSlots, key, slots[key])`

#### normalizeScopedSlot

```js
function normalizeScopedSlot(normalSlots, key, fn) {
  const normalized = function () {
    let res = arguments.length ? fn.apply(null, arguments) : fn({})
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res)
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  }
  xxx
  return normalized
}
```

这里的三个参数是针对`v-slot`的。最后返回了一个函数，先不看具体内容

### normalizeScopedSlots-end

```js
// expose normal slots on scopedSlots
for (const key in normalSlots) {
  if (!(key in res)) {
  	res[key] = proxyNormalSlot(normalSlots, key)
  }
}
```

这里看一下proxyNormalSlot

#### proxyNormalSlot

```js
function proxyNormalSlot(slots, key) {
  return () => slots[key]
}
```

也是返回一个函数

### normalizeScopedSlots-end

```js
if (slots && Object.isExtensible(slots)) {
  (slots: any)._normalized = res
}
```

增加_normalized属性，相当于缓存。

这里normalizeScopedSlots处理完毕，vm.$scopedSlots最后的返回值如下

```js
{
  default: ƒ (),
  footer: ƒ (),
  header: ƒ ()
}
```

## renderSlot-end

this.$scopedSlots的值已经知道了，继续往下看。

```js
const scopedSlotFn = this.$scopedSlots[name]
let nodes
if (scopedSlotFn) { // scoped slot
  props = props || {}
  // 不处理先不看
  xxx
  nodes = scopedSlotFn(props) || fallback
}
```

scopedSlotFn我们可以知道，它对应的是上面三个函数。对于default和header来说，由于他们不是scopedSlot所以调用scopedSlotFn直接返回对于的vnode，这里对应proxyNormalSlot返回的方法。对于footer，他会走normalizeScopedSlot返回的方法，这里看一下

```js
const normalized = function () {
  let res = arguments.length ? fn.apply(null, arguments) : fn({})
  res = res && typeof res === 'object' && !Array.isArray(res)
    ? [res] // single vnode
  : normalizeChildren(res)
  return res && (
    res.length === 0 ||
    (res.length === 1 && res[0].isComment) // #9658
  ) ? undefined
  : res
}
```

这里我们会传入props，对应到`fn.apply`的arguments。props是`{text:"footer"}`，也就是子组件中定义的属性。fn对应的就是

```js
function(props){
  return _c('div',{},[_v("我是"+_s(props.text))])
}
```

这里就会创建对应的vnode然后返回

## 总结

1. scopedSlot相对于普通的插槽在处理上多了一个props，其他的和普通插槽差不多。

