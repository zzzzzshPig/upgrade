> ##此章节涉及到的内容比较多，所以在这里以例子的形式来讲解部分case。
>
> 在这里参考https://ustbhuangyi.github.io/vue-analysis/v2/compile/codegen.html#generate的讲解。

# demo

编译到了最后一步就是把优化后的`AST`转换成可执行的代码，也就是render函数的主体。为了方便理解我们采用一下例子进行讲解：

```html
<ul :class="bindCls" class="list" v-if="isShow">
    <li v-for="(item,index) in data" @click="clickItem(index)">{{item}}:{{index}}</li>
</ul>
```

它经过编译，执行 `const code = generate(ast, options)`，生成的 `render` 代码串如下：

```javascript
with(this){
  return (isShow) ?
    _c('ul', {
        staticClass: "list",
        class: bindCls
      },
      _l((data), function(item, index) {
        return _c('li', {
          on: {
            "click": function($event) {
              clickItem(index)
            }
          }
        },
        [_v(_s(item) + ":" + _s(index))])
      })
    ) : _e()
}
```

## _c

这里的 `_c` 函数定义在 `src/core/instance/render.js` 中。

```js
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
```

## 辅助函数

而 `_l`、`_v` 定义在 `src/core/instance/render-helpers/index.js` 中：

```js
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
}
```

顾名思义，`_c` 就是执行 `createElement` 去创建` VNode`，而 `_l` 对应 `renderList` 渲染列表；`_v` 对应 `createTextVNode` 创建文本 `VNode`；`_e` 对于 `createEmptyVNode`创建空的 `VNode`。

在 `compileToFunctions` 中，会把这个 `render` 代码串转换成函数，它的定义在 `src/compler/to-function.js` 中：

```js
const compiled = compile(template, options)
res.render = createFunction(compiled.render, fnGenErrors)

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code })
    return noop
  }
}
```

实际上就是把 `render` 代码串通过 `new Function` 的方式转换成可执行的函数，赋值给 `vm.options.render`，这样当组件通过 `vm._render` 的时候，就会执行这个 `render` 函数。那么接下来我们就重点关注一下这个 `render` 代码串的生成过程。

## generate

```js
const code = generate(ast, options)
```

generate就是生成render字符串的方法，它定义在`compiler/codegen/index.js`。

```js
export function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  const state = new CodegenState(options)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}
```

这里我们先看`genElement`，它的作用是生成code，也就是代码串，然后再用`with(this){}`包裹起来，with的作用是将块里的代码的context指向传入的对象（类似于`window.a`可以直接省略window一样）。

```js
export function genElement (el: ASTElement, state: CodegenState): string {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre
  }

  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    let code
    if (el.component) {
      code = genComponent(el.component, el, state)
    } else {
      let data
      if (!el.plain || (el.pre && state.maybeComponent(el))) {
        data = genData(el, state)
      }

      const children = el.inlineTemplate ? null : genChildren(el, state, true)
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`
    }
    // module transforms
    for (let i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code)
    }
    return code
  }
}
```

`genElement`比较复杂，针对不同的情况有很多种处理方式，在这里我们根据案例进行讨论不进行所有分支的分析，先讨论genIf和genFor。

### genIf

```js
export function genIf (
  el: any,
  state: CodegenState,
  altGen?: Function,
  altEmpty?: string
): string {
  el.ifProcessed = true // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}
```

这里将`ifProcessed`设置为true是为了防止死循环，因为在接下来的递归中还有可能会用到这个元素。这里主要还是执行`genIfConditions`。

### genIfConditions

```js
function genIfConditions (
  conditions: ASTIfConditions,
  state: CodegenState,
  altGen?: Function,
  altEmpty?: string
): string {
  // 在没有判断条件的情况下，返回'_e()' 因为altEmpty为undefined
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  // 取第一个条件，可能存在多个条件
  const condition = conditions.shift()
  
  if (condition.exp) {
    // 生成三元表达式
    // genIfConditions循环调用的最终目的还是为了调用genTernaryExp
    return `(${condition.exp})?${
      genTernaryExp(condition.block)
    }:${
      genIfConditions(conditions, state, altGen, altEmpty)
    }`
  } else {
    return `${genTernaryExp(condition.block)}`
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    // v-once部分的逻辑先不看，这里会调用genElement结束genIf。
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}
```

`genIfConditions`的最终作用是调用`genTernaryExp`，这里once是v-once部分，先不看，所以最终还是调用了`genElement`，结束了`genIf`。

在我们的例子中，只有一个 `condition`，`exp` 为 `isShow`，因此生成如下伪代码：

```js
return (isShow) ? genElement(el, state) : _e()
```

### genFor

```js
export function genFor (
  el: any,
  state: CodegenState,
  altGen?: Function,
  altHelper?: string
): string {
  const exp = el.for
  const alias = el.alias
  const iterator1 = el.iterator1 ? `,${el.iterator1}` : '' // iterator1...
  const iterator2 = el.iterator2 ? `,${el.iterator2}` : ''

  // 没有key的错误就是在这里报的
  if (process.env.NODE_ENV !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      `<${el.tag} v-for="${alias} in ${exp}">: component lists rendered with ` +
      `v-for should have explicit keys. ` +
      `See https://vuejs.org/guide/list.html#key for more info.`,
      el.rawAttrsMap['v-for'],
      true /* tip */
    )
  }

  el.forProcessed = true // avoid recursion
  return `${altHelper || '_l'}((${exp}),` +
    `function(${alias}${iterator1}${iterator2}){` +
      `return ${(altGen || genElement)(el, state)}` +
    '})'
}
```

`genFor` 的逻辑很简单，首先 AST 元素节点中获取了和 `for` 相关的一些属性，然后返回了一个代码字符串。

在我们的例子中，`exp` 是 `data`，`alias` 是 `item`，`iterator1` ，因此生成如下伪代码：

```js
_l((data), function(item, index) {
  return genElememt(el, state)
})
```

### genData和genChildren

在demo中，最外层元素的`ul`，它有一个v-if指令，在`genIf`之后会再次调用`genElement`，此时还是会判断`if (el.if && !el.ifProcessed)`但是由于`el.ifProcessed`是true所以不会走，其他的else-if也不会走，所以最后会走else。

```js
else {
  // component or element
  let code
  // ul不是component所以不走
  if (el.component) {
    code = genComponent(el.component, el, state)
  } else {
    let data
    if (!el.plain || (el.pre && state.maybeComponent(el))) {
      data = genData(el, state)
    }

    const children = el.inlineTemplate ? null : genChildren(el, state, true)
    code = `_c('${el.tag}'${
      data ? `,${data}` : '' // data
    }${
      children ? `,${children}` : '' // children
    })`
  }
  // module transforms
  for (let i = 0; i < state.transforms.length; i++) {
    code = state.transforms[i](el, code)
  }
  return code
}
```

这里只看genData和genChildren。

#### genData

```js
export function genData (el: ASTElement, state: CodegenState): string {
  let data = '{'

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  const dirs = genDirectives(el, state)
  if (dirs) data += dirs + ','

  // key
  if (el.key) {
    data += `key:${el.key},`
  }
  // ref
  if (el.ref) {
    data += `ref:${el.ref},`
  }
  if (el.refInFor) {
    data += `refInFor:true,`
  }
  // pre
  if (el.pre) {
    data += `pre:true,`
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += `tag:"${el.tag}",`
  }
  // module data generation functions
  for (let i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el)
  }
  // attributes
  if (el.attrs) {
    data += `attrs:${genProps(el.attrs)},`
  }
  // DOM props
  if (el.props) {
    data += `domProps:${genProps(el.props)},`
  }
  // event handlers
  if (el.events) {
    data += `${genHandlers(el.events, false)},`
  }
  if (el.nativeEvents) {
    data += `${genHandlers(el.nativeEvents, true)},`
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += `slot:${el.slotTarget},`
  }
  // scoped slots
  if (el.scopedSlots) {
    data += `${genScopedSlots(el, el.scopedSlots, state)},`
  }
  // component v-model
  if (el.model) {
    data += `model:{value:${
      el.model.value
    },callback:${
      el.model.callback
    },expression:${
      el.model.expression
    }},`
  }
  // inline-template
  if (el.inlineTemplate) {
    const inlineTemplate = genInlineTemplate(el, state)
    if (inlineTemplate) {
      data += `${inlineTemplate},`
    }
  }
  data = data.replace(/,$/, '') + '}'
  // v-bind dynamic argument wrap
  // v-bind with dynamic arguments must be applied using the same v-bind object
  // merge helper so that class/style/mustUseProp attrs are handled correctly.
  if (el.dynamicAttrs) {
    data = `_b(${data},"${el.tag}",${genProps(el.dynamicAttrs)})`
  }
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data)
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data)
  }
  return data
}
```

`genData` 函数就是根据 AST 元素节点的属性构造出一个 `data` 对象字符串，这个在后面创建 VNode 的时候的时候会作为参数传入。

之前我们提到了 `CodegenState` 的实例 `state`，这里有一段关于 `state` 的逻辑：

```js
for (let i = 0; i < state.dataGenFns.length; i++) {
  data += state.dataGenFns[i](el)
}
```

这里的state就是

```js
const state = new CodegenState(options)

export class CodegenState {
  xxx

  constructor (options: CompilerOptions) {
	xxx
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
    xxx
  }
}
```

`dataGenFns`实际上是modules中的`genData`方法，在web平台中的方法定义在`platforms/web/compiler/modules/index.js`，比如class的`getData`

```js
function genData (el: ASTElement): string {
  let data = ''
  if (el.staticClass) {
    data += `staticClass:${el.staticClass},`
  }
  if (el.classBinding) {
    data += `class:${el.classBinding},`
  }
  return data
}
```

在我们的例子中，`ul` AST 元素节点定义了 `el.staticClass` 和 `el.classBinding`，因此最终生成的 `data` 字符串如下：

```js
{
  staticClass: "list",
  class: bindCls
}
```

#### getChildren

```js
export function genChildren (
  el: ASTElement,
  state: CodegenState,
  checkSkip?: boolean,
  altGenElement?: Function,
  altGenNode?: Function
): string | void {
  const children = el.children
  if (children.length) {
    const el: any = children[0]
    // optimize single v-for
    if (children.length === 1 &&
      el.for &&
      el.tag !== 'template' &&
      el.tag !== 'slot'
    ) {
      const normalizationType = checkSkip
        ? state.maybeComponent(el) ? `,1` : `,0`
        : ``
      return `${(altGenElement || genElement)(el, state)}${normalizationType}`
    }
    const normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0
    const gen = altGenNode || genNode
    return `[${children.map(c => gen(c, state)).join(',')}]${
      normalizationType ? `,${normalizationType}` : ''
    }`
  }
}
```

在我们的例子中，`li` AST 元素节点是 `ul` AST 元素节点的 `children` 之一，满足 `(children.length === 1 && el.for && el.tag !== 'template' && el.tag !== 'slot')` 条件，因此通过 `genElement(el, state)` 生成 `li` AST元素节点的代码，也就回到了我们之前调用 `genFor` 生成的代码，把它们拼在一起生成的伪代码如下：

```js
return (isShow) ?
    _c('ul', {
        staticClass: "list",
        class: bindCls
      },
      _l((data), function(item, index) {
        return genElememt(el, state)
      })
    ) : _e()
```

在执行`genElement`时候，当前el指的是`li`，`el.events`不为空，所以在`getData`函数中会进入

```js
if (el.events) {
  data += `${genHandlers(el.events, false)},`
}
```

##### genHandlers

```js
export function genHandlers (
  events: ASTElementHandlers,
  isNative: boolean
): string {
  const prefix = isNative ? 'nativeOn:' : 'on:'
  let staticHandlers = ``
  let dynamicHandlers = ``
  for (const name in events) {
    const handlerCode = genHandler(events[name])
    if (events[name] && events[name].dynamic) {
      dynamicHandlers += `${name},${handlerCode},`
    } else {
      staticHandlers += `"${name}":${handlerCode},`
    }
  }
  staticHandlers = `{${staticHandlers.slice(0, -1)}}`
  if (dynamicHandlers) {
    return prefix + `_d(${staticHandlers},[${dynamicHandlers.slice(0, -1)}])`
  } else {
    return prefix + staticHandlers
  }
}
```

`genHandler` 的逻辑就不介绍了，很大部分都是对修饰符 `modifier` 的处理，感兴趣同学可以自己看，对于我们的例子，它最终 `genData` 生成的 `data` 字符串如下：

```js
{
  on: {
    "click": function($event) {
      clickItem(index)
    }
  }
}
```

##### genNode

在`getChildren`中会执行到`genNode`

```js
const gen = altGenNode || genNode
return `[${children.map(c => gen(c, state)).join(',')}]${
	normalizationType ? `,${normalizationType}` : ''
}`
```

```js
function genNode (node: ASTNode, state: CodegenState): string {
  if (node.type === 1) {
    return genElement(node, state)
  } else if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}
```

这里实际上是对所有子节点进行处理，如果是一个Element则继续递归处理（深度递归），`genComment`和`genText`分别针对注释和文本进行处理。

在我们的例子中，`li` AST 元素节点的 `children` 是 type 为 2 的表达式 AST 元素节点，那么会执行到 `genText(node)` 逻辑。

```js
export function genText (text: ASTText | ASTExpression): string {
  return `_v(${text.type === 2
    ? text.expression
    : transformSpecialNewlines(JSON.stringify(text.text))
  })`
}
```

因此在我们的例子中，`genChildren` 生成的代码串如下：

```js
[_v(_s(item) + ":" + _s(index))]
```

和之前拼在一起，最终生成的 `code` 如下：

```js
 return (isShow) ?
    _c('ul', {
        staticClass: "list",
        class: bindCls
      },
      _l((data), function(item, index) {
        return _c('li', {
          on: {
            "click": function($event) {
              clickItem(index)
            }
          }
        },
        [_v(_s(item) + ":" + _s(index))])
      })
    ) : _e()
```

## 总结

这一节通过例子配合解析，我们对从 `ast -> code` 这一步有了一些了解，编译后生成的代码就是在运行时执行的代码。由于 `genCode` 的内容有很多，所以我对大家的建议是没必要把所有的细节都一次性看完，我们应该根据具体一个 case，走完一条主线即可。

在之后的章节我们会对 `slot` 的实现做解析，我们会重新复习编译的章节，针对具体问题做具体分析，有利于我们排除干扰，对编译过程的学习有更深入的理解。