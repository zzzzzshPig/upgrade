> 这里我们看一下sameVnode为true的情况。

```javascript
if (!isRealElement && sameVnode(oldVnode, vnode)) {
  // patch existing root node
  patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
} 
```

> 这里的代码看起来很简单。。。

```javascript
function patchVnode (
  oldVnode,
  vnode,
  insertedVnodeQueue,
  ownerArray,
  index,
  removeOnly
) {
  // 相同vnode自然不需要再干嘛
  if (oldVnode === vnode) {
    return
  }

  // 不走这里，这里在updateChilden中调用的patchVnode会走
  // 这里的作用就是clone
  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // clone reused vnode
    vnode = ownerArray[index] = cloneVNode(vnode)
  }

  // 因为是相同vnode，节点自然也要相同
  const elm = vnode.elm = oldVnode.elm

  // 异步逻辑，跳过
  if (isTrue(oldVnode.isAsyncPlaceholder)) {
    xxx
  }

  // 静态逻辑，跳过
  if (isTrue(vnode.isStatic) &&
    xxx
  ) {
    xxx
  }

  // 这里首先会调用 i.prepatch 钩子，如果定义了话
  // i.prepatch 主要是对子组件进行数据更新（props，listeners）
  let i
  const data = vnode.data
  if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
    i(oldVnode, vnode)
  }

  const oldCh = oldVnode.children
  const ch = vnode.children
  
  // 指令生命周期update回调
  if (isDef(data) && isPatchable(vnode)) {
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
  }
      
  // 没有文本 不是一个单纯的文本节点 则对比子节点
  if (isUndef(vnode.text)) {
      // 新老vnode都有children 则对比更新children
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    } else if (isDef(ch)) {
        // 新的vnode有children，老的没有
      if (process.env.NODE_ENV !== 'production') {
          // 检测子节点有没有重复的key
        checkDuplicateKeys(ch)
      }
        // 如果老的vnode是一个文本节点，就把文本设置为空
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        // 添加新的vnode的children到elm中
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {
        // 新的没有子节点 老的有 删除掉节点即可
      removeVnodes(oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {
        // 老的节点是文本节点，新的节点不是文本节点，也没有children（有可能是一个占位符，也有可能是一个空节点），此时清掉老节点的文本
      nodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
      // 文本节点 text不同 设置新的text即可
    nodeOps.setTextContent(elm, vnode.text)
  }
  // 调用生命周期postpatch回调（内部用到的）
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
  }
}
```

> 先看一下`prepatch`的逻辑。
>
> ```javascript
> if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
> 	i(oldVnode, vnode)
> }
> ```