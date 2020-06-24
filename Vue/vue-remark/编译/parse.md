### parse

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

### parseHTML

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

### tag

> 我们先来看`if (!lastTag || !isPlainTextElement(lastTag))`的情况。

```javascript
// 找到当前html第一个<
let textEnd = html.indexOf('<')

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

