> 这一节我们来看_update函数，默认的执行逻辑是第一次执行。该方法定义在`instance/lifecycle.js`的lifecycleMixin方法中。

```javascript
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {}
```

> 先来看看参数，vNode其实就是`vm._render()`返回值，`hydrating`不用看。

```javascript
const vm: Component = this
const prevEl = vm.$el
const prevVnode = vm._vnode
const restoreActiveInstance = setActiveInstance(vm)
vm._vnode = vnode
```

> vm指的是实例，preEl指的是dom节点（#app），preVnode指的是实例所对应的vNode（null），第一次patch是没有的，restoreActiveInstance是setActiveInstance()的返回值，这个方法是用来设置当前正在update的vm实例，给其他地方用到的，最后是vnode赋值给_vnode，相当于已经patch过了，下次patch的时候prevVnode就有值了。

```javascript
if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
} else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode)
}
```

>这里我们会走prevVnode，因为它的值是null。看一下`__patch__`，定义在`platforms/web/runtime/index.js`。

```javascript
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

> 这里做了一个判断，是浏览器端的就使用patch否则就是一个空函数。我们发现这个文件定义的位置是在`platforms`下面，也就是说这个东西是可以跨平台的，那么我们在其他环境使用的时候可以根据环境的特性来修改这个`__patch__`方法。patch方法定义在`./patch.js`。

```javascript
export const patch: Function = createPatchFunction({ nodeOps, modules })
```

> 这里我们来分析一下，nodeOps主要是一些操作dom的方法属于web相关，所以在`platforms/web`下。modules里面包含的是钩子函数，由一些平台相关的钩子和Vue基础钩子组成，在patch的过程中会调用到这些钩子。createPatchFunction这个方法属于高阶函数，因为该方法使用了**函数柯里化**来消除平台之间的差异性最后返回patch方法。由于createPatchFunction中的代码比较多，我们只看最后返回的patch方法。

```javascript
return function patch (oldVnode, vnode, hydrating, removeOnly) {}
```

> oldVnode是之前传进来的vm.$el，是一个dom节点，vnode是render生成的vnode，后面两个参数暂时不看。

```javascript
if (isUndef(vnode)) {
  if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
  return
}
```

> vnode如果不存在而oldVnode存在，则销毁掉oldVnode。

```javascript
let isInitialPatch = false
const insertedVnodeQueue = []
```

> isInitialPatch是用来标识是否是初始化patch，注意这里不是指的第一次patch。下面有一行注释empty mount (likely as component), create new root element，主要是针对vm.$el不存在的情况。insertedVnodeQueue是需要被插入的Vnode队列。

```javascript
if (isUndef(oldVnode)) {
	// empty mount (likely as component), create new root element
	isInitialPatch = true
	createElm(vnode, insertedVnodeQueue)
}
```

>  这里主要是针对vm.$el不存在的情况，可以先不看。

```javascript
const isRealElement = isDef(oldVnode.nodeType)
if (!isRealElement && sameVnode(oldVnode, vnode)) {
  // patch existing root node
  patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
}
```

> isRealElement的值应该为true，因为此时oldVnode是#app，下面这个判断是针对oldVnode是vNode进行比较然后patch两个vNode。

```javascript
if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
  	oldVnode.removeAttribute(SSR_ATTR)
  	hydrating = true
}
if (isTrue(hydrating)) {
    if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
        invokeInsertHook(vnode, insertedVnodeQueue, true)
        return oldVnode
    } else if (process.env.NODE_ENV !== 'production') {
        warn(
            'The client-side rendered virtual DOM tree is not matching ' +
            'server-rendered content. This is likely caused by incorrect ' +
            'HTML markup, for example nesting block-level elements inside ' +
            '<p>, or missing <tbody>. Bailing hydration and performing ' +
            'full client-side render.'
        )
    }
}
```

> 针对ssr的，先跳过。

```javascript
oldVnode = emptyNodeAt(oldVnode)
```

> 这个比较简单，就是根据oldVnode（#app）生成一个vNode。

```javascript
const oldElm = oldVnode.elm
const parentElm = nodeOps.parentNode(oldElm)
```

> 获取父节点（body）和本节点（#app）

```javascript
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

> 创建真正的dom，我们看一下这个方法，定义在本文件下。

```javascript
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
)
```

> vnode是render生成的，insertedVnodeQueue此时是[]，parentElm是父节点，refElm是#app的下一个节点，其他三个参数都是undefined暂时不讨论。

```javascript
if (isDef(vnode.elm) && isDef(ownerArray)) {
    // This vnode was used in a previous render!
    // now it's used as a new node, overwriting its elm would cause
    // potential patch errors down the road when it's used as an insertion
    // reference node. Instead, we clone the node on-demand before creating
    // associated DOM element for it.
    vnode = ownerArray[index] = cloneVNode(vnode)
}
```

> 条件不成立，此处跳过。

```javascript
vnode.isRootInsert = !nested // for transition enter check
if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
	return
}
```

> isRootInsert是true，因为nested不存在。createComponent这里是Component的逻辑，先跳过。

```javascript
if (isDef(tag)) {
  if (process.env.NODE_ENV !== 'production') {
    if (data && data.pre) {
      creatingElmInVPre++
    }
    if (isUnknownElement(vnode, creatingElmInVPre)) {
      warn(
        'Unknown custom element: <' + tag + '> - did you ' +
        'register the component correctly? For recursive components, ' +
        'make sure to provide the "name" option.',
        vnode.context
      )
    }
  }

  vnode.elm = vnode.ns
    ? nodeOps.createElementNS(vnode.ns, tag)
    : nodeOps.createElement(tag, vnode)
  setScope(vnode)
```

> tag存在所以走这里，`isUnknownElement`会对vnode的tag进行检测，如果不是component也不是平台本身的tag会报warn。

```javascript
vnode.elm = vnode.ns
? nodeOps.createElementNS(vnode.ns, tag)
: nodeOps.createElement(tag, vnode)
setScope(vnode)
```

> 这里会走createElement来创建dom，ns是namescape，应该是给component用的，在这里是undefined。setScope是css scope用的。

```javascript
if (__WEXX__) {...} else {
    createChildren(vnode, children, insertedVnodeQueue)
    if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue)
    }
    insert(parentElm, vnode.elm, refElm)
}
```

>`createChildren`这里比较重要，也不难，其实就是对vnode的children进行递归遍历生成dom然后放入insertedVnodeQueue中。节点生成完毕后就插入节点到parent（body），此时页面有两个div#app。

```javascript
function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
        if (process.env.NODE_ENV !== 'production') {
        checkDuplicateKeys(children)
        }
        for (let i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
        }
    } else if (isPrimitive(vnode.text)) {
    	nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
    }
}
```

> 递归的过程中发现是一个普通的文本节点则直接appendChild。

```javascript
} else if (isTrue(vnode.isComment)) {
    vnode.elm = nodeOps.createComment(vnode.text)
    insert(parentElm, vnode.elm, refElm)
} else {
    vnode.elm = nodeOps.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
}
```

> 最后是对没有tag存在的vnode进行处理，实际上是注释和文本节点，createElm走完了，回到patch。

```javascript
// update parent placeholder node element, recursively
if (isDef(vnode.parent)) {
  let ancestor = vnode.parent
  const patchable = isPatchable(vnode)
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
}
```

> 这一段代码不会走到，因为它是根节点，没有父级vnode，暂时跳过。

```javascript
if (isDef(parentElm)) {
  removeVnodes([oldVnode], 0, 0)
} else if (isDef(oldVnode.tag)) {
  invokeDestroyHook(oldVnode)
}
```

> 最后销毁掉之前的dom（上一个#app），如果是组件还需要destory掉然后重新创建。这里我们暂时走完了patch流程（不是很深入），回到`instance/lifecycle.js`。

```javascript
restoreActiveInstance()
// update __vue__ reference
if (prevEl) {
  prevEl.__vue__ = null
}
if (vm.$el) {
  vm.$el.__vue__ = vm
}
// if parent is an HOC, update its $el as well
if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
  vm.$parent.$el = vm.$el
}
```

> 这里比较简单，因为patch完了，所以`restoreActiveInstance`，然后更新一下`__vue__`的引用。最后如果parent也是组件就需要更新一下$el，但是这里因为没有parent所以不会走到。

> update短暂的过了一遍，但是这个功能在Vue里面是非常重要的一个功能，里面涉及到很多知识点，比如component的处理，那么在下一章中我们就来看下component相关的知识。