> 这里我们看一下`sameVnode`为false的情况，本节代码定义在`vdom/patch.js`。

```javascript
if (isRealElement) {
  xxx
  oldVnode = emptyNodeAt(oldVnode)
}
```

> 服务端渲染逻辑，跳过。

```javascript
// replacing existing element
const oldElm = oldVnode.elm
const parentElm = nodeOps.parentNode(oldElm)
```

> 下面会用到。

```javascript
// create new node
createElm(
  vnode,
  insertedVnodeQueue,
  // extremely rare edge case: do not insert if old element is in a
  // leaving transition. Only happens when combining transition +
  // keep-alive + HOCs. (#4590)
  oldElm._leaveCb ? null : parentElm,
  nodeOps.nextSibling(oldElm)
)
```

> 这里就是创建一个新的`dom`节点，内容先跳过。

```javascript
if (isDef(vnode.parent)) {
  let ancestor = vnode.parent
  const patchable = isPatchable(vnode)
  while (ancestor) {
      // 销毁vnode相关特性 这里有很多
    for (let i = 0; i < cbs.destroy.length; ++i) {
      cbs.destroy[i](ancestor)
    }
    ancestor.elm = vnode.elm
    if (patchable) {
      // 创建vnode相关特性，这里有很多
      for (let i = 0; i < cbs.create.length; ++i) {
        cbs.create[i](emptyNode, ancestor)
      }
      // #6513
      // invoke insert hooks that may have been merged by create hooks.
      // e.g. for directives that uses the "inserted" hook.
      const insert = ancestor.data.hook.insert
      if (insert.merged) {
        // start at index 1 to avoid re-invoking component mounted hook
        for (let i = 1; i < insert.fns.length; i++) {
          insert.fns[i]()
        }
      }
    } else {
      registerRef(ancestor)
    }
    ancestor = ancestor.parent
  }
}
```

> 这一段代码就是递归的对父级占位节点进行更新，这里涉及到一个函数`isPatchable`，看一下。

```javascript
function isPatchable (vnode) {
  while (vnode.componentInstance) {
    vnode = vnode.componentInstance._vnode
  }
  return isDef(vnode.tag)
}
```

> 这里代码比较简单，就是判断是不是一个可以挂载的真实节点，而不是组件占位符。回到之前的逻辑。

```javascript
while (ancestor) {
    for (let i = 0; i < cbs.destroy.length; ++i) {
        cbs.destroy[i](ancestor)
    }
    ancestor.elm = vnode.elm
    if (patchable) {
        for (let i = 0; i < cbs.create.length; ++i) {
            cbs.create[i](emptyNode, ancestor)
        }
        // #6513
        // invoke insert hooks that may have been merged by create hooks.
        // e.g. for directives that uses the "inserted" hook.
        const insert = ancestor.data.hook.insert
        if (insert.merged) {
            // start at index 1 to avoid re-invoking component mounted hook
            for (let i = 1; i < insert.fns.length; i++) {
                insert.fns[i]()
            }
        }
    } else {
        registerRef(ancestor)
    }
    ancestor = ancestor.parent
}
```

>在递归对组件更新占位符节点的同时也会触发一系列的`vnode`相关函数和insert hook，进行节点的插入。我们继续往下看。

```javascript
// destroy old node
if (isDef(parentElm)) {
  removeVnodes([oldVnode], 0, 0)
} else if (isDef(oldVnode.tag)) {
  invokeDestroyHook(oldVnode)
}
```

> 这一段就是用来销毁掉旧的`dom`节点的。
