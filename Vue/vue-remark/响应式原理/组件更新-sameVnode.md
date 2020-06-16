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
      
  // 
  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    } else if (isDef(ch)) {
      if (process.env.NODE_ENV !== 'production') {
        checkDuplicateKeys(ch)
      }
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {
      removeVnodes(oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
      // text不同 设置新的text即可
    nodeOps.setTextContent(elm, vnode.text)
  }
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
  }
}
```