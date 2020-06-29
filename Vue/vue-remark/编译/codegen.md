> 此章节涉及到的内容比较多，所以在这里以例子的形式来讲解部分case。
>
> 在这里参考https://ustbhuangyi.github.io/vue-analysis/v2/compile/codegen.html#generate的讲解。

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

