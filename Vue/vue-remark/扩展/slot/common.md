

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
2. 重点的部分应该是runtime阶段，下一节更精彩。

