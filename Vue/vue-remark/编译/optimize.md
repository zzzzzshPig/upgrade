> optimize流程发生在parse之后，主要是对静态节点做标记，我们这章节就是来看看啥是静态节点，optimize函数定义在`compiler/optimizer.js`。

# optimize

```javascript
export function optimize (root: ?ASTElement, options: CompilerOptions) {
  if (!root) return
  isStaticKey = genStaticKeysCached(options.staticKeys || '')
  isPlatformReservedTag = options.isReservedTag || no
  // first pass: mark all non-static nodes.
  markStatic(root)
  // second pass: mark static roots.
  markStaticRoots(root, false)
}
```

## genStaticKeysCached

```javascript
const genStaticKeysCached = cached(genStaticKeys)
isStaticKey = genStaticKeysCached(options.staticKeys || '')

function genStaticKeys (keys: string): Function {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
    (keys ? ',' + keys : '')
  )
}
```

> `type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap`这些`ast`对象的key是基础的，keys是平台相关的key。
>
> `genStaticKeysCached`将获取到的keys做一个缓存，因为这个是固定的不会变的所以直接缓存下来。

## markStatic

```javascript
function markStatic (node: ASTNode) {
  node.static = isStatic(node) // mark
  
  // dom节点
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    // 组件插槽的内容不可以是静态的
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (let i = 0, l = node.children.length; i < l; i++) {
      // 递归设置child的static
      const child = node.children[i]
      markStatic(child)
      // child不是static，node也不是
      if (!child.static) {
        node.static = false
      }
    }
    // 针对v-if进行特殊处理
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block
        markStatic(block)
        if (!block.static) {
          node.static = false
        }
      }
    }
  }
}
```

### isStatic

```javascript
function isStatic (node: ASTNode): boolean {
  // type2 表示表达式
  if (node.type === 2) { // expression
    return false
  }
  // type3 表示纯文本
  if (node.type === 3) { // text
    return true
  }
  // v-pre
  // noBind, noif, nofor, no build-it(slot, component)
  // isPlatformReservedTag是平台标签(div, span...)
  // isDirectChildOfTemplateFor: v-for template的child
  // node对象的key 是isStaticKey
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}
```

## markStaticRoots

```javascript
function markStaticRoots (node: ASTNode, isInFor: boolean) {
  // dom节点
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor // 第一次是false，因为root节点不能有v-for
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    /* 
    !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )
    针对children只有一个的，如果这个子元素是文本节点 staticRoot为false
    这里针对仅有一个子节点并且子节点是文本节点的节点设置为false 是为了性能优化，参见上面注释
    */
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true
      return
    } else {
      node.staticRoot = false
    }
    // 递归设置staticRoot
    if (node.children) {
      for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for)
      }
    }
    // 针对if特殊处理
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        markStaticRoots(node.ifConditions[i].block, isInFor)
      }
    }
  }
}
```

# 总结

那么至此我们分析完了 `optimize` 的过程，就是深度遍历这个 AST 树，去检测它的每一颗子树是不是静态节点，如果是静态节点则它们生成 DOM 永远不需要改变，这对运行时对模板的更新起到极大的优化作用。

我们通过 `optimize` 我们把整个 AST 树中的每一个 AST 元素节点标记了 `static` 和 `staticRoot`，它会影响我们接下来执行代码生成的过程。