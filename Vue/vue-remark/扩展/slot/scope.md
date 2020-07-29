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

上一节讲普通slot的compiler的时候提到过scope slot，这里就直接说了，parse阶段的处理在processSlotContent中。

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
	key: "props",
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
	key: "props",
	fn: function(props){
    return _c('div',{},[_v("我是"+_s(props.text))])
  }
}])
```

需要注意的是，这里使用的是_u，对应的render方法是resolveScopedSlots，详细的在runtime中再讲，这里只需要了解即可。这里对于父级的scopeslots就处理完毕了，那么在子组件中的slot有什么不一样的呢，处理方法在genSlot中。

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

1. 对于父组件来说，在parse阶段scopeSlots将scopedSlots挂载到了父级中，父级在generate阶段会新增scopedSlots属性，调用_u方法创建scopedSlots。
2. 对于子组件来说，parse阶段无特别的内容，在generate阶段会对attrs进行处理，处理后的值当作_t的第三个参数传入，也就是props。

