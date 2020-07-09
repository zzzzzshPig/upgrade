在编译阶段，Vue对于事件的处理放在了processAttrs中，入口文件在`compiler/parse/index.js`。

# processAttrs

```js
function processAttrs (el) {
  xxx
  for (i = 0, l = list.length; i < l; i++) {
    xxx
    if (dirRE.test(name)) {
      xxx
      if (bindRE.test(name)) { // v-bind
        xxx
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '')
        isDynamic = dynamicArgRE.test(name)
        if (isDynamic) {
          name = name.slice(1, -1)
        }
        addHandler(el, name, value, modifiers, false, warn, list[i], isDynamic)
      } else { // normal directives
        xxx
      }
    } else {
      xxx
    }
  }
}
```

匹配到事件以后将匹配到的v-on,@去掉，然后对动态指令进行处理，取[dynamicEventName]中的dynamicEventName，然后调用addHandler。可以看到，调用addHandler之前的操作其实就是把事件名取出来。

## dirRE

```js
export const dirRE = process.env.VBIND_PROP_SHORTHAND
  ? /^v-|^@|^:|^\.|^#/
  : /^v-|^@|^:|^#/
```

用于匹配指令的正则表达式，可以匹配`['v-bind', 'v-html', 'v-on', '@click', ':test=1', '#header']`等

## onRe

```js
export const onRE = /^@|^v-on:/
```

用于匹配事件的，可以匹配`['@click', 'v-on', '@customEvent']`

# addHandler

定义在`compiler/helper.js`

```js
export function addHandler (
  el: ASTElement,
  name: string,
  value: string,
  modifiers: ?ASTModifiers,
  important?: boolean,
  warn?: ?Function,
  range?: Range,
  dynamic?: boolean
) {
  modifiers = modifiers || emptyObject
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    process.env.NODE_ENV !== 'production' && warn &&
    modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.',
      range
    )
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  if (modifiers.right) {
    if (dynamic) {
      name = `(${name})==='click'?'contextmenu':(${name})`
    } else if (name === 'click') {
      name = 'contextmenu'
      delete modifiers.right
    }
  } else if (modifiers.middle) {
    if (dynamic) {
      name = `(${name})==='click'?'mouseup':(${name})`
    } else if (name === 'click') {
      name = 'mouseup'
    }
  }

  // check capture modifier
  if (modifiers.capture) {
    delete modifiers.capture
    name = prependModifierMarker('!', name, dynamic)
  }
  if (modifiers.once) {
    delete modifiers.once
    name = prependModifierMarker('~', name, dynamic)
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive
    name = prependModifierMarker('&', name, dynamic)
  }

  let events
  if (modifiers.native) {
    delete modifiers.native
    events = el.nativeEvents || (el.nativeEvents = {})
  } else {
    events = el.events || (el.events = {})
  }

  const newHandler: any = rangeSetItem({ value: value.trim(), dynamic }, range)
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers
  }

  const handlers = events[name]
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler)
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler]
  } else {
    events[name] = newHandler
  }

  el.plain = false
}
```

newHandler之前的代码是对修饰符进行处理，rangeSetItem的作用是新增传入对象`{ value: value.trim(), dynamic }`的start和end属性，值为range的start和end的值。然后把多余的Vue没有处理的modifiers设置到对象中。event是`el.nativeEvents `或者`el.events`，最后把事件添加到evnet[name]中。这里的value设置为字符串需要注意一下，在后面的render函数生成的时候会被放入函数中。

## rangeSetItem

```js
function rangeSetItem (
  item: any,
  range?: { start?: number, end?: number }
) {
  if (range) {
    if (range.start != null) {
      item.start = range.start
    }
    if (range.end != null) {
      item.end = range.end
    }
  }
  return item
}
```

到这里parse的过程就已经处理完了，接下来看生成代码阶段对于事件怎么处理，入口在`compiler/codegen/index.js`中的`genElement`函数。

# genElement

```js
export function genElement (el: ASTElement, state: CodegenState): string {
  xxx
  else {
    xxx
    else {
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

在调用genData的时候会处理events，处理完后生成的data会传入到_c中，也就是createElement，和手写render函数传入的`{attr: xxx, on: xxx}`一样。

## genData

定义在`compiler/codegen/index.js`

```js
export function genData (el: ASTElement, state: CodegenState): string {
  xxx
  // event handlers
  if (el.events) {
    data += `${genHandlers(el.events, false)},`
  }
  if (el.nativeEvents) {
    data += `${genHandlers(el.nativeEvents, true)},`
  }
  xxx
}
```

这里调用了genHandlers，定义在`compiler/codegen/events.js`。

### genHandlers

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

这里对所有event进行遍历，调用genHandler，最终生成一串诸如`"on:{"click":function($event){toggle = !toggle}}"`的字符串。

### genHandler

```js
function genHandler (handler: ASTElementHandler | Array<ASTElementHandler>): string {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return `[${handler.map(handler => genHandler(handler)).join(',')}]`
  }

  const isMethodPath = simplePathRE.test(handler.value)
  const isFunctionExpression = fnExpRE.test(handler.value)
  const isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''))

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value
    }
    xxx
    return `function($event){${
      isFunctionInvocation ? `return ${handler.value}` : handler.value
    }}` // inline statement
  } else {
    let code = ''
    let genModifierCode = ''
    const keys = []
    for (const key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key]
        // left/right
        if (keyCodes[key]) {
          keys.push(key)
        }
      } else if (key === 'exact') {
        const modifiers: ASTModifiers = (handler.modifiers: any)
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(keyModifier => !modifiers[keyModifier])
            .map(keyModifier => `$event.${keyModifier}Key`)
            .join('||')
        )
      } else {
        keys.push(key)
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys)
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode
    }
    const handlerCode = isMethodPath
      ? `return ${handler.value}($event)`
      : isFunctionExpression
        ? `return (${handler.value})($event)`
        : isFunctionInvocation
          ? `return ${handler.value}`
          : handler.value
    xxx
    return `function($event){${code}${handlerCode}}`
  }
}
```

> 这个就是生成event string的函数，对于handler是数组的情况会遍历递归调用getHandler对每个hander进行处理。在没有修饰符的情况下如果value是函数表达式（`function(){}`）或者value是函数（`customEvent`）则直接返回value，否则返回`function($event){xxx}`，这就是`@click="a($event)"`中的$event的由来。对于有修饰符未处理的情况比较复杂，这里不作讨论，最后会生成Code在handlerCode之前执行，handlerCode生成的规则是根据isMethodPath，isFunctionExpression，isFunctionInvocation来的，这三个正则分别对应`return a.b.c.d($event)`，`return (function(){})($event)`，`return a.b.c.d()`类似的返回值。

# 总结

* 在编译阶段的事件处理是把event生成为`{on: click: function ()) {}}`这种形式，然后传入createdElement函数作为第二参数，和手写render函数使用方法一致。
* 在对编译阶段的处理主要是针对用法适配，修饰符的处理，不算真正的调用，对于dom事件的触发还需要进一步的处理。