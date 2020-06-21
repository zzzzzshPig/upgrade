> 在`Vue`工程项目中，我们一般情况下不会用到compiler版本，会使用`Vue-loader`将template，自定义render都编译成render函数。在实际运行环境下会跳过compiler直接调用预先生成好的render函数，从而达到一定的性能优化。

> 我们这次要看的是带compiler版本的`Vue`，探索`Vue`对于模板编译这一环节是怎么实现的。本章节不做过深的探讨，属于随性而为，只需要了解具体思想和编程技巧即可。

> 从`platforms/web/entry-runtime-with-compiler.js`开始。

```javascript
// 对于不同的版本，对应的$mount不一样，这里是compiler对应的$mount.
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
    // 获取到需要挂载的节点
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
      // 没有自定义render函数，用template
    let template = options.template
    // 获取 template html
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
      
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

        // 这里是核心，将template转换成render函数
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      
      // 为什么要赋值给options.render，因为后续会使用options.render生成Vnode。
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}
```

> 上面这段的作用是将template转化为render函数（如果使用的是template），核心在于`compileToFunctions`，它定义在`platforms/web/compiler/index.js`。

```javascript
import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
```

> 可以看到，`compileToFunctions`是从`createCompiler`中返回的，看下`createCompiler`，定义在`compiler/index.js`。

```javascript
import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

> 注释的意思是这里导出的是默认的compiler实现。在这里是用的一个高阶函数，先来看`baseCompile`。
>
> 它的作用是生成`ast`，对`ast`进行优化，最后把`ast`生成为`vnode`（`ast：abstract syntax tree(抽象语法树) `https://en.wikipedia.org/wiki/Abstract_syntax_tree）。
>
> 对于以上三个步骤的具体内容先不做讨论，接下来我们看一下`createCompilerCreator`，定义在`compiler/create-compiler.js`。

```javascript
export function createCompilerCreator (baseCompile: Function): Function {
    // baseCompile 上面那个三部曲
  return function createCompiler (baseOptions: CompilerOptions) {
      // baseOptions是和编译平台相关的一些配置
      // 定义compile函数，createCompiler函数末尾会用到
    function compile (
      template: string,
      options?: CompilerOptions
    ): CompiledResult {
      // 原型继承，方便扩展
      const finalOptions = Object.create(baseOptions)
      const errors = []
      const tips = []

      // 报警告，不看
      let warn = (msg, range, tip) => {
        (tip ? tips : errors).push(msg)
      }

      /* options = 
        {
        	outputSourceRange: process.env.NODE_ENV !== 'production',
            shouldDecodeNewlines,
            shouldDecodeNewlinesForHref,
            delimiters: options.delimiters,
            comments: options.comments
        }
      */
      // 扩展finalOptions
      if (options) {
        if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
          // $flow-disable-line
          const leadingSpaceLength = template.match(/^\s*/)[0].length

          warn = (msg, range, tip) => {
            const data: WarningMessage = { msg }
            if (range) {
              if (range.start != null) {
                data.start = range.start + leadingSpaceLength
              }
              if (range.end != null) {
                data.end = range.end + leadingSpaceLength
              }
            }
            (tip ? tips : errors).push(data)
          }
        }
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules)
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          )
        }
        // copy other options
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key]
          }
        }
      }

      // 编译的过程中会用到
      finalOptions.warn = warn

      // 调用三部曲
      const compiled = baseCompile(template.trim(), finalOptions)
      if (process.env.NODE_ENV !== 'production') {
        detectErrors(compiled.ast, warn)
      }
      // 编译状态，编译提示
      compiled.errors = errors
      compiled.tips = tips
      return compiled
    }

    // 以上只是定义函数，最后会调用createCompileToFunctionFn
    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}
```

> 上面代码是定义了compile，最后是调用`createCompileToFunctionFn`，定义在`compiler/toFunction.js`。

```javascript
export function createCompileToFunctionFn (compile: Function): Function {
    // 闭包机制，cache是用来缓存编译结果的，相同内容编译一次即可。
  const cache = Object.create(null)

  // 这里实际上就是最开始入口处调用的函数，中间的过程相当于装饰器
  return function compileToFunctions (
    template: string,
    options?: CompilerOptions,
    vm?: Component
  ): CompiledFunctionResult {
      // 继承options
    options = extend({}, options)
    // warn = baseWarn
    const warn = options.warn || baseWarn
    delete options.warn

      // 当前环境支持判断
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      // detect possible CSP restriction
      try {
        new Function('return 1')
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          )
        }
      }
    }

    // check cache
    const key = options.delimiters
      ? String(options.delimiters) + template
      : template
    // 可以看到，这里的key是根据template内容来进行缓存的
    if (cache[key]) {
      return cache[key]
    }

    // 这里调用前面解释过的compiler，返回compiled
    // compile
    const compiled = compile(template, options)

    // 对错误和提示进行处理
    // check compilation errors/tips
    if (process.env.NODE_ENV !== 'production') {
      if (compiled.errors && compiled.errors.length) {
        if (options.outputSourceRange) {
          compiled.errors.forEach(e => {
            warn(
              `Error compiling template:\n\n${e.msg}\n\n` +
              generateCodeFrame(template, e.start, e.end),
              vm
            )
          })
        } else {
          warn(
            `Error compiling template:\n\n${template}\n\n` +
            compiled.errors.map(e => `- ${e}`).join('\n') + '\n',
            vm
          )
        }
      }
      if (compiled.tips && compiled.tips.length) {
        if (options.outputSourceRange) {
          compiled.tips.forEach(e => tip(e.msg, vm))
        } else {
          compiled.tips.forEach(msg => tip(msg, vm))
        }
      }
    }

    // turn code into functions
    const res = {}
    const fnGenErrors = []
    // 将返回的render字符串转成 function
    // createFunction下面会讲到
    res.render = createFunction(compiled.render, fnGenErrors)
    res.staticRenderFns = compiled.staticRenderFns.map(code => {
      return createFunction(code, fnGenErrors)
    })

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          `Failed to generate render function:\n\n` +
          fnGenErrors.map(({ err, code }) => `${err.toString()} in\n\n${code}\n`).join('\n'),
          vm
        )
      }
    }

    // 记录缓存 返回res
    return (cache[key] = res)
  }
}
```

> 看一下`createFunction`。

```javascript
function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code })
    return noop
  }
}
```

> 将render字符串放入new Function，生成render函数。

> 最后return的值`render，staticRenderFns`就是render函数。

### 总结

1. 由于不同的平台特性需要不同的compiler，所以`Vue`对compiler的处理显得很绕。
2. compiler的核心是`compiler/index.js`中的`baseCompile`，在这里生成render字符串，其他的高阶函数如`createCompilerCreator,createCompileToFunctionFn`作用类似装饰器。