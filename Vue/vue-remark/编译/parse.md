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
// last = 每次开始解析html之前的html ，lastTag = 结尾标签
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

> 我们先来看`if (!lastTag || !isPlainTextElement(lastTag))`的情况。

```javascript
// 找到第一个<
let textEnd = html.indexOf('<')

// 当前是开始标签，类似<div>
if (textEnd === 0) {
  // Comment:
  if (comment.test(html)) {
    // 匹配注释结束符号
    const commentEnd = html.indexOf('-->')

    // 如果存在注释结束符号
    if (commentEnd >= 0) {
      // 需要保留注释的话 生成一个注释ast
      if (options.shouldKeepComment) {
        options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3)
      }
      // index走到注释结束的位置
      advance(commentEnd + 3)
      continue
    }
  }

  // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
  if (conditionalComment.test(html)) {
    const conditionalEnd = html.indexOf(']>')

    if (conditionalEnd >= 0) {
      advance(conditionalEnd + 2)
      continue
    }
  }

  // Doctype:
  const doctypeMatch = html.match(doctype)
  if (doctypeMatch) {
    advance(doctypeMatch[0].length)
    continue
  }

  // End tag:
  const endTagMatch = html.match(endTag)
  if (endTagMatch) {
    const curIndex = index
    advance(endTagMatch[0].length)
    parseEndTag(endTagMatch[1], curIndex, index)
    continue
  }

  // Start tag:
  const startTagMatch = parseStartTag()
  if (startTagMatch) {
    handleStartTag(startTagMatch)
    if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
      advance(1)
    }
    continue
  }
}
```

