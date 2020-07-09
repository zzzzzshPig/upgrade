# parse

> parse内容很多，这里以流程为主，有些细节就不扣了。parse函数定义在`compiler/parser/index.js`，由于这个函数内容比较多，这里就不直接列出来了。

```javascript
export function parse (
  template: string,
  options: CompilerOptions
): ASTElement | void {}
```

> 先看参数，template就是`Vue`模板字符串。options是编译时候会用到的配置，由`baseOptions`扩展而来，具体可以看`compiler/create-compier.js`。
>
> 再看返回值，`ASTElement`表示的是`ast`对象，具体可以看它的类型声明。

```javascript
// 用于显示错误信息的
warn = options.warn || baseWarn

// is <pre> tag
platformIsPreTag = options.isPreTag || no
// 标签必须使用的属性
platformMustUseProp = options.mustUseProp || no
// 获取标签命名空间 针对svg 和 math的
platformGetTagNamespace = options.getTagNamespace || no
// 时候是保留标签
const isReservedTag = options.isReservedTag || no
// 判断组件（maybe）
maybeComponent = (el: ASTElement) => !!el.component || !isReservedTag(el.tag)

// 一些类似于钩子函数的东西
transforms = pluckModuleFunction(options.modules, 'transformNode')
preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
postTransforms = pluckModuleFunction(options.modules, 'postTransformNode')

// 分隔符
delimiters = options.delimiters

// stack，放astElement用的
const stack = []
// 保留空白
const preserveWhitespace = options.preserveWhitespace !== false
// 空格选项
const whitespaceOption = options.whitespace
// 返回值，astElement
let root
// 当前astElement的父级
let currentParent
// v-pre
let inVPre = false
// 标识现在是不是在处理<pre>标签
let inPre = false
let warned = false
```

> 以上定义的很多变量都是在接下来的parse过程中会用到的。。。继续看。。。

```javascript
parseHTML(template, {
  warn,
  expectHTML: options.expectHTML, // 是否需要符合HTML标准
  isUnaryTag: options.isUnaryTag, // 自闭合标签
  canBeLeftOpenTag: options.canBeLeftOpenTag, // <p><div>123</div></p> 不符合规范会被转换为<p></p><div>123</div><p></p>，这个时候就相当于把<p>转化为了<p></p>
  shouldDecodeNewlines: options.shouldDecodeNewlines, // 是否编码换行
  shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref, // 是否为Href解码新行
  shouldKeepComment: options.comments, // 是否保留注释
  outputSourceRange: options.outputSourceRange, // 输出源范围
    
  // 太多了不想看
  xxx
})
```

> 这里调用了`parseHTML`，定义在`./html-parser.js`，`Vue`的`parseHTML`借鉴了`John Resig`大神写的，具体可以看http://erik.eae.net/simplehtmlparser/simplehtmlparser.js，这里的内容也很多，慢慢来。

# parseHTML

```javascript
export function parseHTML (html, options) {}
```

> 看看参数，`html`是template，options是上面那一大串。

```javascript
// 类似于 { tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end } 这样的数组，和之前的AstElement类似。
const stack = []
// 是否需要符合HTML标准
const expectHTML = options.expectHTML
// 自闭合标签
const isUnaryTag = options.isUnaryTag || no
// 上面解释过，可以看上面的解释
const canBeLeftOpenTag = options.canBeLeftOpenTag || no
// 标准的 下标索引。。。这里用来表示当前解析到了哪一个字符
let index = 0
// last = 每次开始解析html之前的html ，lastTag = 前一个标签
let last, lastTag
```

> 上面是参数的初始化，下面有一段比较长的代码，我们根据if块来分析比较合理。

```javascript
while (html) {
  // 保存每次开始解析html之前的html
  last = html
  
  // lastTag不存在，或者lastTag 不是 script,style,textarea
  // 第一次是会走这里的
  if (!lastTag || !isPlainTextElement(lastTag)) {
      xxx
  } else {
      xxx
  }
    
  // 结束解析
  if (html === last) {
      options.chars && options.chars(html)
      if (process.env.NODE_ENV !== 'production' && !stack.length && options.warn) {
          options.warn(`Mal-formatted tag at end of template: "${html}"`, { start: index + html.length })
      }
      break
  }
}
```

## tag

> 先看`if (!lastTag || !isPlainTextElement(lastTag))`

```javascript
// 找到当前html第一个<
let textEnd = html.indexOf('<')
```

### textEnd === 0

```javascript
// 0表示 处理的是标签
if (textEnd === 0) {
  // Comment:
  // comment = /^<!\--/
  // 匹配 <!-- 这是一段注释 -->
  if (comment.test(html)) {
    // 匹配注释结束位置
    const commentEnd = html.indexOf('-->')

    if (commentEnd >= 0) {
      // 需要保留注释的话 生成一个注释ast
      if (options.shouldKeepComment) {
        options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3) // mark下面会看
      }
      // index = 注释结束的长度
      advance(commentEnd + 3) // mark下面会看
      continue
    }
  }

  // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
  // conditionalComment = /^<!\[/
  // 匹配 <![CDATA[ ... ]]>
  if (conditionalComment.test(html)) {
    // 匹配条件注释语句结束位置
    const conditionalEnd = html.indexOf(']>')

    if (conditionalEnd >= 0) {
      // index = conditionalComment的长度
      advance(conditionalEnd + 2)
      continue
    }
  }

  // Doctype:
  // doctype = /^<!DOCTYPE [^>]+>/i
  // 匹配 <!DOCTYPE html>
  const doctypeMatch = html.match(doctype)
  if (doctypeMatch) {
    // index = <!DOCTYPE html>的长度
    advance(doctypeMatch[0].length)
    continue
  }

  // End tag:
  // const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
  // const qnameCapture = `((?:${ncname}\\:)?${ncname})`
  // const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
  // 匹配</div>
  const endTagMatch = html.match(endTag)
  if (endTagMatch) {
    // index = index + </div>的长度
    const curIndex = index
    advance(endTagMatch[0].length)
    // 解析end tag
    parseEndTag(endTagMatch[1], curIndex, index) // mark下面会看
    continue
  }

  // Start tag:
  // 匹配<div class="class attr" style="style attr">
  const startTagMatch = parseStartTag() // mark下面会看
  if (startTagMatch) {
    handleStartTag(startTagMatch) // mark下面会看
    // 换行，eq: <div>
    //              123     
    //          </div>
    if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
      advance(1)
    }
    continue
  }
}
```

#### options.comment

```javascript
comment (text: string, start, end) {
  // adding anyting as a sibling to the root node is forbidden
  // comments should still be allowed, but ignored
  if (currentParent) {
    const child: ASTText = {
      type: 3,
      text,
      isComment: true
    }
    // 源码调试
    if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
      child.start = start
      child.end = end
    }
    currentParent.children.push(child)
  }
}
```

> 作用比较简单就是生成一个 ASTText，isComment设置为true即可。

#### advance

```javascript
function advance (n) {
  index += n
  html = html.substring(n)
}
```

> 更新下标，更新当前还剩html。

#### parseEndTag

```javascript
// 假设参数是 </div>, 5, 10
function parseEndTag (tagName, start, end) {
  let pos, lowerCasedTagName
  if (start == null) start = index
  if (end == null) end = index

  // Find the closest opened tag of the same type
  // 翻译：找到最近的相同类型的标签  
  // eq: <div></div> find: div
  if (tagName) {
    lowerCasedTagName = tagName.toLowerCase()
    for (pos = stack.length - 1; pos >= 0; pos--) {
      if (stack[pos].lowerCasedTag === lowerCasedTagName) {
        break
      }
    }
  } else {
    // If no tag name is provided, clean shop
    pos = 0
  }

  if (pos >= 0) {
    // Close all the open elements, up the stack
    for (let i = stack.length - 1; i >= pos; i--) {
      if (process.env.NODE_ENV !== 'production' &&
        (i > pos || !tagName) &&
        options.warn
      ) {
        options.warn(
          `tag <${stack[i].tag}> has no matching end tag.`,
          { start: stack[i].start, end: stack[i].end }
        )
      }
      // 触发end
      if (options.end) {
        options.end(stack[i].tag, start, end) // mark下面会看
      }
    }

    // Remove the open elements from the stack
    stack.length = pos
    lastTag = pos && stack[pos - 1].tag // 更新前一个标签
  } else if (lowerCasedTagName === 'br') {
    // 针对br进行处理 </br>
    if (options.start) {
      options.start(tagName, [], true, start, end) // 这个在parseStartTag时候再看
    }
  } else if (lowerCasedTagName === 'p') {
    // 针对p标签进行处理
    if (options.start) {
      options.start(tagName, [], false, start, end)
    }
    if (options.end) {
      options.end(tagName, start, end)
    }
  }
}
```

#### options.end

```javascript
// 假设参数是 div, 5, 10
end (tag, start, end) {
  const element = stack[stack.length - 1]
  // pop stack
  stack.length -= 1
  currentParent = stack[stack.length - 1]
  if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
    element.end = end
  }
  closeElement(element) // 这里要看一下
}
```

> 这里将最后一个节点删除，然后对节点进行处理
>
> `<div><p></p></div>`这里会先删除p，然后再删除div
>
> 重点看一下closeElement。

#### closeElement

```javascript
function closeElement (element) {
  // 去掉结尾空格
  trimEndingWhitespace(element)
  // 对element的属性做处理，比如ref,slot,is... 还有v-bind:语法解析等
  // 这个是处理vue指令 和属性的位置，很重要 代码也很多，这里只做功能说明
  if (!inVPre && !element.processed) {
    element = processElement(element, options)
  }
  // tree management
  // 针对多个 root 进行处理
  if (!stack.length && element !== root) {
    // allow root elements with v-if, v-else-if and v-else
    if (root.if && (element.elseif || element.else)) {
      // 检查root是否是slot template 或者 是否有v-for指令
      if (process.env.NODE_ENV !== 'production') {
        checkRootConstraints(element)
      }
      // 处理v-if判断逻辑
      addIfCondition(root, {
        exp: element.elseif,
        block: element
      })
    } else if (process.env.NODE_ENV !== 'production') {
      // 报错
      warnOnce(
        `Component template should contain exactly one root element. ` +
        `If you are using v-if on multiple elements, ` +
        `use v-else-if to chain them instead.`,
        { start: element.start }
      )
    }
  }
  // 子节点
  if (currentParent && !element.forbidden) {
    // 处理v-if 逻辑
    if (element.elseif || element.else) {
      processIfConditions(element, currentParent)
    } else {
      // slot 先跳过
      if (element.slotScope) {
        // scoped slot
        // keep it in the children list so that v-else(-if) conditions can
        // find it as the prev node.
        const name = element.slotTarget || '"default"'
        ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element
      }
      currentParent.children.push(element)
      element.parent = currentParent
    }
  }

  // final children cleanup
  // filter out scoped slots
  element.children = element.children.filter(c => !(c: any).slotScope)
  // remove trailing whitespace node again
  trimEndingWhitespace(element)

  // check pre state
  // 恢复VPre状态，结束标签置为false
  if (element.pre) {
    inVPre = false
  }
  // pre标签也一样
  if (platformIsPreTag(element.tag)) {
    inPre = false
  }
  // apply post-transforms
  for (let i = 0; i < postTransforms.length; i++) {
    postTransforms[i](element, options)
  }
}
```

#### parseStartTag

```javascript
function parseStartTag () {
  // const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
  // const qnameCapture = `((?:${ncname}\\:)?${ncname})`
  // const startTagOpen = new RegExp(`^<${qnameCapture}`)
  // 匹配 <div :id="custom_id">
  const start = html.match(startTagOpen)
  if (start) {
    const match = {
      tagName: start[1], // div
      attrs: [],
      start: index
    }
    // 前进到 > 后面
    advance(start[0].length)
    let end, attr
    // const startTagClose = /^\s*(\/?)>/
    // 匹配 > 或者 />
    // const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
    // 匹配 @click="handleClick" :value="1" #header(slot)
    // const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
    // 匹配 class="custom_class" disabled
    while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
      // 这段代码的作用是把attr解析出来 并且移动index
      attr.start = index
      advance(attr[0].length)
      attr.end = index
      match.attrs.push(attr)
    }
    if (end) {
      // unarySlash自闭合标签 对应到正则中的(\/?)
      match.unarySlash = end[1]
      // 移动index
      advance(end[0].length)
      match.end = index
      return match
    }
  }
}
```

> 这里是做attr的收集，具体处理会在end中。

#### handleStartTag

```javascript
function handleStartTag (match) {
  const tagName = match.tagName // div
  const unarySlash = match.unarySlash // '' 或者 /

  if (expectHTML) {
    // p标签含有不能包含的标签的话 闭合该p标签
    if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
      parseEndTag(lastTag)
    }
    // 闭合不能包含相同标签的标签，colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source
    if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
      parseEndTag(tagName)
    }
  }

  // 是否是子闭合标签
  const unary = isUnaryTag(tagName) || !!unarySlash

  // 下面这段的作用是 对attr进行解析
  const l = match.attrs.length
  const attrs = new Array(l)
  for (let i = 0; i < l; i++) {
    const args = match.attrs[i]
    const value = args[3] || args[4] || args[5] || ''
    const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
      ? options.shouldDecodeNewlinesForHref
      : options.shouldDecodeNewlines
    attrs[i] = {
      name: args[1],
      value: decodeAttr(value, shouldDecodeNewlines) // &gt to >, &lt to <
    }
    // 方便调试用的
    if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
      attrs[i].start = args.start + args[0].match(/^\s*/).length
      attrs[i].end = args.end
    }
  }

  // tag入栈
  if (!unary) {
    stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end })
    lastTag = tagName
  }

  if (options.start) {
    options.start(tagName, attrs, unary, match.start, match.end) // mark
  }
}
```

#### options.start

```javascript
start (tag, attrs, unary, start, end) {
  // check namespace.
  // inherit parent ns if there is one
  const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag)

  // handle IE svg bug
  /* istanbul ignore if */
  if (isIE && ns === 'svg') {
    attrs = guardIESVGBug(attrs)
  }

  // 创建一个AST
  let element: ASTElement = createASTElement(tag, attrs, currentParent)
  if (ns) {
    element.ns = ns
  }

  // 无关紧要的部分
  xxx

  // apply pre-transforms
  for (let i = 0; i < preTransforms.length; i++) {
    element = preTransforms[i](element, options) || element
  }

  if (!inVPre) {
    // has v-pre so. element.pre = true
    processPre(element)
    if (element.pre) {
      inVPre = true
    }
  }
  // <pre>
  if (platformIsPreTag(element.tag)) {
    inPre = true
  }
  // 处理属性 和 指令
  if (inVPre) {
    processRawAttrs(element)
  } else if (!element.processed) {
    // structural directives
    processFor(element)
    processIf(element)
    processOnce(element)
  }

  // root
  if (!root) {
    root = element
    if (process.env.NODE_ENV !== 'production') {
      checkRootConstraints(root)
    }
  }

  // 自闭合标签处理
  if (!unary) {
    currentParent = element
    stack.push(element)
  } else {
    closeElement(element)
  }
}
```

> start中很多地方都是针对pre的，v-pre指令的作用是跳过这个元素和它的子元素的编译过程。在处理指令的processFor，processIf，processOnce等地方都会进行判断（包括closeElement中的processElement也是进行了判断），从而跳过编译。

### textEnd >= 0

```javascript
let text, rest, next
// 这个等于号感觉有点多余
if (textEnd >= 0) {
  // 这段内容有可能是文本
  rest = html.slice(textEnd)
  while (
    !endTag.test(rest) && // 不是结束标签
    !startTagOpen.test(rest) && // 不是开始标签
    !comment.test(rest) && // 不是注释
    !conditionalComment.test(rest) // 不是条件注释
  ) {
    // < in plain text, be forgiving and treat it as text
    next = rest.indexOf('<', 1)
    if (next < 0) break
    textEnd += next
    // rest的值是去掉text后剩下的html
    rest = html.slice(textEnd)
  }
  // 获取text
  text = html.substring(0, textEnd)
}
```

> 这段的作用是获取text的内容。

### textEnd < 0

```javascript
if (textEnd < 0) {
  text = html
}
```

> 没有标签则表示全是文本。

### options.chars

```javascript
chars (text: string, start: number, end: number) {
  // 无关紧要 跳过
  xxxx
  const children = currentParent.children
  
  if (inPre || text.trim()) {
    // isTextTag判断script,style
    // decodeHTMLCached一个缓存机
    text = isTextTag(currentParent) ? text : decodeHTMLCached(text)
  } else if (!children.length) {
    // remove the whitespace-only node right after an opening tag
    text = ''
  } else if (whitespaceOption) {
    // 对空格进行处理
    if (whitespaceOption === 'condense') {
      // in condense mode, remove the whitespace node if it contains
      // line break, otherwise condense to a single space
      text = lineBreakRE.test(text) ? '' : ' '
    } else {
      text = ' '
    }
  } else {
    text = preserveWhitespace ? ' ' : ''
  }
  if (text) {
    if (!inPre && whitespaceOption === 'condense') {
      // condense consecutive whitespaces into single space
      text = text.replace(whitespaceRE, ' ')
    }
    let res
    let child: ?ASTNode
    // parseText这个方法比较重要 下面会讲到
    if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
      child = {
        type: 2,
        expression: res.expression,
        tokens: res.tokens,
        text
      }
    } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
      child = {
        type: 3,
        text
      }
    }
    if (child) {
      if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
        child.start = start
        child.end = end
      }
      children.push(child)
    }
  }
}
```

> options.chars是用来解析text的，<div>aaaa{{bb}}</div>，charts指的是aaaa{{bb}}。

#### parseText

```javascript
// 解析text {{aaa}} + {{bbb}}
export function parseText (
  text: string,
  delimiters?: [string, string]
): TextParseResult | void {
  // 如果传入了delimiters则使用buildRegex(delimiters)做为解析符，默认{{xxx}}
  // 例如['$', '$'] 对应 $aaa$ + $bbb$
  const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE
  // 没有{{}}，不需要解析
  if (!tagRE.test(text)) {
    return
  }
  const tokens = []
  const rawTokens = []
  let lastIndex = tagRE.lastIndex = 0
  let match, index, tokenValue
  while ((match = tagRE.exec(text))) {
    index = match.index
    // push text token
    // {{a}}
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index))
      tokens.push(JSON.stringify(tokenValue))
    }
    // tag token
    // filters {{a | b}}
    const exp = parseFilters(match[1].trim())
    tokens.push(`_s(${exp})`)
    rawTokens.push({ '@binding': exp })
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex))
    tokens.push(JSON.stringify(tokenValue))
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}
```

> parseText是用来解析{{}}的。

### isPlainTextElement

```javascript
let endTagLength = 0
const stackedTag = lastTag.toLowerCase()
const reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'))
const rest = html.replace(reStackedTag, function (all, text, endTag) {
  endTagLength = endTag.length
  if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
    text = text
      .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
      .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1')
  }
  if (shouldIgnoreFirstNewline(stackedTag, text)) {
    text = text.slice(1)
  }
  if (options.chars) {
    options.chars(text)
  }
  return ''
})
// 为啥没使用advance?
index += html.length - rest.length
html = rest
parseEndTag(stackedTag, index - endTagLength, index)
```

> 这段不是太理解，先跳过，关系不大。



# 总结

* 那么至此，`parse` 的过程就分析完了，看似复杂，但我们可以抛开细节理清它的整体流程。`parse` 的目标是把 `template` 模板字符串转换成 AST 树，它是一种用 JavaScript 对象的形式来描述整个模板。那么整个 `parse` 的过程是利用正则表达式顺序解析模板，当解析到开始标签、闭合标签、文本的时候都会分别执行对应的回调函数，来达到构造 AST 树的目的。
* AST 元素节点总共有 3 种类型，`type` 为 1 表示是普通元素，为 2 表示是表达式，为 3 表示是纯文本。其实这里我觉得源码写的不够友好，这种是典型的魔术数字，如果转换成用常量表达会更利于源码阅读。
* 当 AST 树构造完毕，下一步就是 `optimize` 优化这颗树。
* 这一章节内容巨多，不要求全部掌握，但是心里要清楚这个概念。实际上Vue的template处理了很多复杂的内容，包括解析HTML，生成AST等，所以Vue的template才能显得很友好，用起来很方便。Vue为了容易上手这四个字做了很多处理，也做了很多妥协。