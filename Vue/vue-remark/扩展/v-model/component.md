component分为compiler和runtime两个阶段。

# compiler

对于component的v-model处理分为parse和generate两个阶段。

## parse

parse阶段对于v-model的处理会走addDirective方法，入口在processAttrs方法。processAttrs方法定义在`compiler/parser/index.js`。

```js
function processAttrs (el) {
  const list = el.attrsList
  let i, l, name, rawName, value, modifiers, syncGen, isDynamic
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name
    value = list[i].value
    if (dirRE.test(name)) {
      xxx
      else { // normal directives
        name = name.replace(dirRE, '')
        // parse arg
        const argMatch = name.match(argRE)
        let arg = argMatch && argMatch[1]
        isDynamic = false
        if (arg) {
          name = name.slice(0, -(arg.length + 1))
          if (dynamicArgRE.test(arg)) {
            arg = arg.slice(1, -1)
            isDynamic = true
          }
        }
        addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i])
        if (process.env.NODE_ENV !== 'production' && name === 'model') {
          checkForAliasModel(el, value)
        }
      }
    }
    xxx
  }
}
```

addDirective入口在`compiler/helper.js`。

```js
export function addDirective (
  el: ASTElement,
  name: string,
  rawName: string,
  value: string,
  arg: ?string,
  isDynamicArg: boolean,
  modifiers: ?ASTModifiers,
  range?: Range
) {
  (el.directives || (el.directives = [])).push(rangeSetItem({
    name,
    rawName,
    value,
    arg,
    isDynamicArg,
    modifiers
  }, range))
  el.plain = false
}
```

添加完了directives属性后接下来就是genarate阶段了。

## generate

generate对于component的处理在genElement函数中，定义在`compiler/codegen/index.js`。

```js
export function genElement (el: ASTElement, state: CodegenState): string {
  xxx
  else {
    // component or element
    let code
    if (el.component) {
      code = genComponent(el.component, el, state)
    } else {
      xxx
    }
    xxx
  }
}
```

### genComponent

```js
function genComponent (
  componentName: string,
  el: ASTElement,
  state: CodegenState
): string {
  const children = el.inlineTemplate ? null : genChildren(el, state, true)
  return `_c(${componentName},${genData(el, state)}${
    children ? `,${children}` : ''
  })`
}
```

调用genData。

```js
export function genData (el: ASTElement, state: CodegenState): string {
  let data = '{'

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  const dirs = genDirectives(el, state)
  if (dirs) data += dirs + ','
    
  xxx
}
```

genDirectives之前讲过，具体逻辑不再重复，在genDirectives函数中会调用v-model指令的具体处理方法，它定义在`compiler/directives/model.js`。

```js
export default function model (
  el: ASTElement,
  dir: ASTDirective,
  _warn: Function
): ?boolean {
  xxx

  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers)
    // component v-model doesn't need extra runtime
    return false
  }

  xxx

  // ensure runtime directive metadata
  return true
}
```

在这里，对于component来说会调用genComponentModel。这里需要注意`//component v-model doesn't need extra runtime`这段注释，在genDirectives调用完毕后会跳过`if (dirs) data += dirs + ','`。

### genComponentModel

```js
export function genComponentModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
): ?boolean {
  const { number, trim } = modifiers || {}

  const baseValueExpression = '$$v'
  let valueExpression = baseValueExpression
  if (trim) {
    valueExpression =
      `(typeof ${baseValueExpression} === 'string'` +
      `? ${baseValueExpression}.trim()` +
      `: ${baseValueExpression})`
  }
  if (number) {
    valueExpression = `_n(${valueExpression})`
  }
  const assignment = genAssignmentCode(value, valueExpression)

  el.model = {
    value: `(${value})`,
    expression: JSON.stringify(value),
    callback: `function (${baseValueExpression}) {${assignment}}`
  }
}
```

trim和number都是对修饰符的处理，逻辑不复杂。genAssignmentCode之前提到过，会返回赋值表达式的字符串，最后会在el中设置model属性，设置完model属性后genData后续会处理。

```js
if (el.model) {
    data += `model:{value:${
        el.model.value
    },callback:${
        el.model.callback
    },expression:${
        el.model.expression
    }},`
}
```

这里对最后为生成的vnode设置了model属性，在后续的runtime中会被使用到。

# runtime

对于component的处理肯定在createComponent中，定义在`core/vdom/create-component.js`。

## createComponent

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  xxx

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }

  xxx
}
```

注释说的很明确了，transformModel就是处理component v-model的方法。

## transformModel

```js
function transformModel (options, data: any) {
  const prop = (options.model && options.model.prop) || 'value'
  const event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value
  const on = data.on || (data.on = {})
  const existing = on[event]
  const callback = data.model.callback
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing)
    }
  } else {
    on[event] = callback
  }
}
```

整个逻辑不难，就是向props中添加一个叫value的prop并且向data.on中添加一个input事件（如果组件没有设置model属性或者没有设置event，prop），这段代码说明component v-model本质上还是也是一个语法糖，它自动的绑定相关事件而不需要手动绑定。

# 总结

* v-model本质上就是一个语法糖，不管是普通的dom还是component。
* 对于component v-model来说，compiler的作用是为vnode生成model属性，createComponent的作用是添加所需prop和event。
* options.model和compiler生成的model不是同一个model，options指的是component instance，compiler生成的指的是vnode。

