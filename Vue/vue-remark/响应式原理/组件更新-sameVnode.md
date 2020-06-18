> 这里我们看一下sameVnode为true的情况。

```javascript
if (!isRealElement && sameVnode(oldVnode, vnode)) {
  // patch existing root node
  patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
} 
```

> 这里的代码看起来很简单。。。先看一下sameVnode。

```javascript
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```

> 首先判断`key`，这里一般是对`v-for`的判断，其他的默认是`undefined`。第二块内容是判断`tag`，也就是`div,span,img`等标签名，`isComment`基本是给`v-if`逻辑用的，两者必须都定义了data，最后判断`sameInputType`（不是input类型返回true）。第三块内容是针对异步组件的先不看，回到`patchVnode`。

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
>
> 定义在`vdom/create-component.js`。
>
> ```javascript
> prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
>   const options = vnode.componentOptions
>   const child = vnode.componentInstance = oldVnode.componentInstance
>   updateChildComponent(
>     child,
>     options.propsData, // updated props
>     options.listeners, // updated listeners
>     vnode, // new parent vnode
>     options.children // new children
>   )
> }
> ```
>
> 这里逻辑没什么特殊的地方，看`updateChildComponent`，定义在`instance/lifecycle.js`。
>
> ```javascript
> export function updateChildComponent (
>   vm: Component,
>   propsData: ?Object,
>   listeners: ?Object,
>   parentVnode: MountedComponentVNode,
>   renderChildren: ?Array<VNode>
> ) {
>     // 更其他地方判断，提示错误用的
>   if (process.env.NODE_ENV !== 'production') {
>     isUpdatingChildComponent = true
>   }
> 
>   // slot部分，跳过
>   xxx
> 
>   // 更新父级引用
>   vm.$options._parentVnode = parentVnode
>     // 更新占位符vnode
>   vm.$vnode = parentVnode // update vm's placeholder node without re-render
> 
>   if (vm._vnode) { // update child tree's parent
>     vm._vnode.parent = parentVnode
>   }
>     // 更新children为new children
>   vm.$options._renderChildren = renderChildren
> 
>   // update $attrs and $listeners hash
>   // these are also reactive so they may trigger child update if the child
>   // used them during render
>     // 更新挂载在组件上的数据以及事件
>   vm.$attrs = parentVnode.data.attrs || emptyObject
>   vm.$listeners = listeners || emptyObject
> 
>   // update props
>   if (propsData && vm.$options.props) {
>       // 这里获取prop的值 因为已经observe过了，所以不需要observe。
>     toggleObserving(false)
>     const props = vm._props
>     const propKeys = vm.$options._propKeys || []
>     for (let i = 0; i < propKeys.length; i++) {
>       const key = propKeys[i]
>       const propOptions: any = vm.$options.props // wtf flow?
>         // 检测prop是否有效
>       props[key] = validateProp(key, propOptions, propsData, vm)
>     }
>       // 恢复observe
>     toggleObserving(true)
>     // keep a copy of raw propsData
>     vm.$options.propsData = propsData
>   }
> 
>   // update listeners
>   listeners = listeners || emptyObject
>   const oldListeners = vm.$options._parentListeners
>   vm.$options._parentListeners = listeners
>     // 更新Listeners
>   updateComponentListeners(vm, listeners, oldListeners)
> 
>   // slot部分，跳过
>   xxx
>  
>   // 恢复状态
>   if (process.env.NODE_ENV !== 'production') {
>     isUpdatingChildComponent = false
>   }
> }
> ```
>
> 可以看到，`prepatch`的作用是对`vnode`进行更新，更新了引用关系，父子数据，组件数据等。现在我们回到`patchVnode`。

> 再看一下update的逻辑。
>
> ```javascript
> if (isDef(data) && isPatchable(vnode)) {
>   for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
>   if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
> }
> ```
>
> 这里需要满足是一个可以被插入到`dom`中的一个`vnode`。cbs是vnode生命周期的回调，是vue本身的机制。`data.hook.update`没有找到相关定义。。。继续往下看。

```javascript
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
}
```

> 这里就只看`updateChildren`，这里是逻辑复用的核心，这里的逻辑异常复杂，我们重点理解每一个case的意思，不深究。

```javascript
// 整体逻辑类似于快排，使用的是前后指针扫描的方法进行遍历两个children数组，找到不同之处进行处理
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    // 这里为了方便注释，修改了变量定义顺序，无实际影响。
    
    // 四个指针，前后各两个，新老各两个
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newEndIdx = newCh.length - 1
  
  // 四个vnode，前后各两个，新老各两个
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm

  // removeOnly is a special flag used only by <transition-group>
  // to ensure removed elements stay in correct relative positions
  // during leaving transitions
  const canMove = !removeOnly // 这里把canMove看作true

  // 检查有无重复key
  if (process.env.NODE_ENV !== 'production') {
    checkDuplicateKeys(newCh)
  }

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      // 发生过复用中间节点的逻辑（头头，头尾，尾尾均不相同的时候），下面会看到什么时候为undefined
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
    } else if (isUndef(oldEndVnode)) {
      // 发生过复用中间节点的逻辑（头头，头尾，尾尾均不相同的时候），下面会看到什么时候为undefined
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 头头比较
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        // 指针右移
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 尾尾比较（其实就算不做处理，最后也会处理，有可能在while循环中处理，也有可能当成一个新的节点插入或者被remove，可能会浪费一点内存和时间），这里其实核心思想就是能复用的节点就复用，绝对不浪费！！！和头头比较基本相似
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        // 指针左移
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        // 头尾比较
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        // 移动dom节点（就地复用）
      canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm移动dom节点（就地复用）, nodeOps.nextSibling(oldEndVnode.elm))
        // oldstart指针右移，newend指针左移
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        // 和上面相反
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
      canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
        // 第一次判断会是undefined
        // 在oldVnode中找一个可以复用的节点
      if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        // 如果key相同，直接取相同key的dom 
        // 否则找一个和newStartVnode 相同的 oldvnode
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        
        // 无相同节点，创建新节点
      if (isUndef(idxInOld)) { // New element
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
      } else {
        vnodeToMove = oldCh[idxInOld]
          // 相同节点，patch
        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
          oldCh[idxInOld] = undefined
          canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
        } else {
            // 注释说的很清楚
          // same key but different element. treat as new element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        }
      }
        // 指针右移
      newStartVnode = newCh[++newStartIdx]
    }
  }
    
    // oldStartIdx > oldEndIdx 说明old走完了，new没走完（也有可能走完了），那就把new剩下的插入即可
  if (oldStartIdx > oldEndIdx) {
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
  } else if (newStartIdx > newEndIdx) {
    // new走完了，old没走完（也有可能走完了），那就把多余的删掉即可
    removeVnodes(oldCh, oldStartIdx, oldEndIdx)
  }
}
```

> 好一段dom节点复用逻辑！！！情况虽然很复杂但是细品之下还是很有意思的，这里使用递归patchVnode，最后生成dom tree。patch到最后无非就是处理一些text节点了，如果没有text都不用处理了。。。

> 到这里组件更新的逻辑基本就搞定了，虽然比较长，但是其中的dom复用逻辑还是值得揣摩的，弄懂了这里的话，对于vue的优化就又掌握了新的技巧~~~擅用key哦~