v-model在parse阶段的入口文件是`compiler/parser/index.js`。

# parse阶段

## processAttrs

```js
function processAttrs (el) {
    xxx
    // normal directives
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
    xxx
}
```

这里对属性进行解析之后调用了addDirective，它的作用是给el添加指令，定义在`compiler/helpers.js`。

### addDirective

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

看一下参数，以v-model="value"为例，name是model，rawName是v-model，value是value，arg是null，isDynamicAry是false，modifiers是undefined，range是一个含有start和end属性的对象，addDirective后会让el添加类似下面这样的值

```js
el = {
	directives: [{
		name: 'model',
		rawName: 'v-model',
        value: 'value',
        arg: null,
        isDynamicArg: false,
        modifiers: undefined,
        start: 46,
        end: 61
	}]
}
```

那么设置完了directives之后parse中关于v-model的部分就结束了，下面就是generate阶段了。

# generate阶段

## genData

```js
export function genData (el: ASTElement, state: CodegenState): string {
  let data = '{'

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  const dirs = genDirectives(el, state)
  
  xxx
}
```

对于v-model指令的处理在genDirectives方法中。

## genDirectives

```js
function genDirectives (el: ASTElement, state: CodegenState): string | void {
  const dirs = el.directives
  if (!dirs) return
  let res = 'directives:['
  let hasRuntime = false
  let i, l, dir, needRuntime
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i]
    needRuntime = true
    const gen: DirectiveFunction = state.directives[dir.name]
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn)
    }
    if (needRuntime) {
      hasRuntime = true
      res += `{name:"${dir.name}",rawName:"${dir.rawName}"${
        dir.value ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}` : ''
      }${
        dir.arg ? `,arg:${dir.isDynamicArg ? dir.arg : `"${dir.arg}"`}` : ''
      }${
        dir.modifiers ? `,modifiers:${JSON.stringify(dir.modifiers)}` : ''
      }},`
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}
```

这里段代码最后会返回'directives:[xxx]'，里面逻辑比较绕，因为涉及到自定义指令和平台特性相关的处理所以`state.directives[dir.name]`显得很绕，这里的directives是`extend(extend({}, baseDirectives), options.directives)`，v-model相关的在options.directives中，它的值又是在`platforms/web/compiler/index.js`中传入的

```js
const { compile, compileToFunctions } = createCompiler(baseOptions)
```

baseOptions.directives的值是

```js
export default {
  model,
  text,
  html
}
```

那么这里就找到了对于model指令的处理了，它定义在`platforms/web/compiler/directives/model.js`

```js
export default function model (
  el: ASTElement,
  dir: ASTDirective,
  _warn: Function
): ?boolean {
  warn = _warn
  const value = dir.value
  const modifiers = dir.modifiers
  const tag = el.tag
  const type = el.attrsMap.type

  if (process.env.NODE_ENV !== 'production') {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn(
        `<${el.tag} v-model="${value}" type="file">:\n` +
        `File inputs are read only. Use a v-on:change listener instead.`,
        el.rawAttrsMap['v-model']
      )
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers)
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers)
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers)
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers)
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers)
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers)
    // component v-model doesn't need extra runtime
    return false
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `<${el.tag} v-model="${value}">: ` +
      `v-model is not supported on this element type. ` +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.',
      el.rawAttrsMap['v-model']
    )
  }

  // ensure runtime directive metadata
  return true
}
```

这里处理的条件很多，就不一个个看了，只看`tag === 'input' || tag === 'textarea'`的情况，这种情况会调用genDefaultModel方法。

### genDefaultModel

```js
function genDefaultModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
): ?boolean {
  const type = el.attrsMap.type

  // warn if v-bind:value conflicts with v-model
  // except for inputs with v-bind:type
  xxx

  const { lazy, number, trim } = modifiers || {}
  const needCompositionGuard = !lazy && type !== 'range'
  const event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input'

  let valueExpression = '$event.target.value'
  if (trim) {
    valueExpression = `$event.target.value.trim()`
  }
  if (number) {
    valueExpression = `_n(${valueExpression})`
  }

  let code = genAssignmentCode(value, valueExpression)
  if (needCompositionGuard) {
    code = `if($event.target.composing)return;${code}`
  }

  addProp(el, 'value', `(${value})`)
  addHandler(el, event, code, null, true)
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()')
  }
}
```

在`v-model='value'`这个例子中，`lazy, number, trim` 都是undefined，needCompositionGuard为true，

event为input。接着是调用genAssignmentCode方法获取code。

#### genAssignmentCode

```js
export function genAssignmentCode (
  value: string,
  assignment: string
): string {
  const res = parseModel(value)
  if (res.key === null) {
    return `${value}=${assignment}`
  } else {
    return `$set(${res.exp}, ${res.key}, ${assignment})`
  }
}
```

这里的parseModel就不细看了，最后会返回

```js
{
	key: null,
	exp: 'value'
}
```

genAssignmentCode最后会返回`value=$event.target.value`

### genDefaultModel

此时code = `value=$event.target.value`，needCompositionGuard为true所以code被覆盖为`if($event.target.composing)return;value=$event.target.value`，最后的两段代码很有意思

```js
addProp(el, 'value', `(${value})`)
addHandler(el, event, code, null, true)
```

这两段代码告诉我们，v-model的本质实际上是一个语法糖，它帮助我们自动在v-model节点上绑定一个value值和一个input事件（其他类型的节点会是其他类型的事件，比如change），然后在input事件中会改变value的值，以此达到数据的更新，所以v-model本质上是一个语法糖。

## genDirectives

```js
if (needRuntime) {
    hasRuntime = true
    res += `{name:"${dir.name}",rawName:"${dir.rawName}"${
        dir.value ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}` : ''
    }${
        dir.arg ? `,arg:${dir.isDynamicArg ? dir.arg : `"${dir.arg}"`}` : ''
    }${
        dir.modifiers ? `,modifiers:${JSON.stringify(dir.modifiers)}` : ''
    }},`
}
```

这段代码在gen调用后执行，因为needRuntime为true，最后生成了类似

`directives:[{name: "model", rawName: "v-model", value: value, expression: value}]`这样的数据。最后返回的数据类似这样`"with(this){return _c('div',{attrs:{"id":"app"}},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(value),expression:"value"}],attrs:{"type":"text"},domProps:{"value":(value)},on:{"input":function($event){if($event.target.composing)return;value=$event.target.value}}}),_v(" ")])}"`，可以看到，domProps上新增了一个value，on上新增了一个input事件。

# 总结

* v-model本质上是一个语法糖，自动给节点v-bind:value和监听input事件，在不同的类型的节点下绑定的事件是不一样的。
* 在编译阶段生成代码之后，在runtime时候会被调用，第一次调用是初始化时候，第二次就是input回调被调用的时候，下面来看一下v-model的runtime时。