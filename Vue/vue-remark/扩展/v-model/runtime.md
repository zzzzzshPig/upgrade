v-model本质上是一个自定义指令，只不过它是官方写的。那么对于v-model的runtime来说，分为两个部分，一个是加载directive逻辑，一个是v-model逻辑。我们先来看v-model逻辑，这一部分相对简单，定义在`platforms/web/runtime/directives/model.js`。

# v-model的directive

```js
const directive = {
  inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      xxx
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers
      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart)
        el.addEventListener('compositionend', onCompositionEnd)
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd)
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true
        }
      }
    }
  },

  componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      xxx
    }
  }
}
```

可以看到，这里的directive和我们平时写的自定义指令是一样的。在这里我们只讨论input，不讨论select。那么对于input的情况可以看到有个lazy的判断，在compiler时如果有lazy修饰符则添加change事件否则添加input事件，所以这里有判断是lazy就不需要添加composition相关事件，composition相关事件可以看这里https://developer.mozilla.org/zh-CN/docs/Web/Events/compositionstart。这里总共用到了两个函数onCompositionStart和onCompositionEnd，先来看一下onCompositionStart。

## onCompositionStart

```js
function onCompositionStart (e) {
  e.target.composing = true
}
```

这里讲composing设置为true，看起来好像很突兀，但是我们在compiler阶段讲过，v-model本质上是一个语法糖，它会给vnode添加一个input或者change事件，事件函数体中会有这么一段代码。`if($event.target.composing)return;`，也就是说在compositionStart时候input事件会直接return，就不会有修改值的操作了。

## onCompositionEnd

```js
function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) return
  e.target.composing = false
  trigger(e.target, 'input')
}
```

这里就是输入结束，调用input事件了，此时`e.target.composing`就是false了。

> 那么到这里directive阶段就已经走完了，接下来看看自定义指令的加载逻辑。

# 自定义指令的加载逻辑

自定义指令的加载逻辑发生在vnode的生命周期，也就是说vnode的增加，更新，删除操作会触发指令相关事件，所以自定义指令的加载逻辑肯定在patch中。

## 入口

文件定义在`platforms/web/runtime/patch.js`。

```js
/* @flow */

import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })
```

baseModules就是directives和ref。

## createPatchFunction

```js
let i, j
const cbs = {}

const { modules, nodeOps } = backend

for (i = 0; i < hooks.length; ++i) {
  cbs[hooks[i]] = []
  for (j = 0; j < modules.length; ++j) {
    if (isDef(modules[j][hooks[i]])) {
      cbs[hooks[i]].push(modules[j][hooks[i]])
    }
  }
}
```

这里对modules进行了依次合并处理，将directives的create，update，destory合并进hooks中，然后在invokeCreateHooks中触发create hooks。

### invokeCreateHooks

```js
function invokeCreateHooks (vnode, insertedVnodeQueue) {
  for (let i = 0; i < cbs.create.length; ++i) {
    cbs.create[i](emptyNode, vnode)
  }
  i = vnode.data.hook // Reuse variable
  if (isDef(i)) {
    if (isDef(i.create)) i.create(emptyNode, vnode)
    if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
  }
}
```

这里对create进行了调用，那么对directives来说，它的create是啥呢？定义在`vdom/modules/directive.js`。

```js
export default {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode: VNodeWithData) {
    updateDirectives(vnode, emptyNode)
  }
}
```

可以看到，create就是updateDirectives。

#### updateDirectives

```js
function updateDirectives (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode)
  }
}
```

updateDirectives就是_update。

#### _update

```js
function _update (oldVnode, vnode) {
  const isCreate = oldVnode === emptyNode
  const isDestroy = vnode === emptyNode
  const oldDirs = normalizeDirectives(oldVnode.data.directives, oldVnode.context)
  const newDirs = normalizeDirectives(vnode.data.directives, vnode.context)

  const dirsWithInsert = []
  const dirsWithPostpatch = []

  let key, oldDir, dir
  for (key in newDirs) {
    oldDir = oldDirs[key]
    dir = newDirs[key]
    if (!oldDir) {
      // new directive, bind
      callHook(dir, 'bind', vnode, oldVnode)
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir)
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value
      dir.oldArg = oldDir.arg
      callHook(dir, 'update', vnode, oldVnode)
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir)
      }
    }
  }

  if (dirsWithInsert.length) {
    const callInsert = () => {
      for (let i = 0; i < dirsWithInsert.length; i++) {
        callHook(dirsWithInsert[i], 'inserted', vnode, oldVnode)
      }
    }
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert)
    } else {
      callInsert()
    }
  }

  xxx
}
```

比较长，我们只看create部分。首先将inserted方法都放入dirsWithInsert中，然后再调用mergeVNodeHook。

##### mergeVNodeHook

```js
export function mergeVNodeHook (def: Object, hookKey: string, hook: Function) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {})
  }
  let invoker
  const oldHook = def[hookKey]

  function wrappedHook () {
    hook.apply(this, arguments)
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook)
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook])
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook
      invoker.fns.push(wrappedHook)
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook])
    }
  }

  invoker.merged = true
  def[hookKey] = invoker
}
```

首先生成或获取vnode.data.hook，然后调用createFnInvoker，这个createFnInvoker我们之前讲到过，这里就不赘述了，创建完invoker之后插入到insert中。这里的invoker只会被调用一次，在wrappedHook调用后会remove  wrappedHook。mergeVNodeHook完了之后会在vnode.data.hooks中生成insert方法，那么他又是在哪里调用的呢？

#### patch

```js
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

在patch函数中，createElm之后的一段代码中调用了vnode.data.hook.insert，这里对`insert.fns[i]()`进行调用，相当于调用了wrappedHook。

> insert了解之后，还有一个componentUpdated，它的调用在更新的时候。

### patchVnode

```js
function patchVnode (
  oldVnode,
  vnode,
  insertedVnodeQueue,
  ownerArray,
  index,
  removeOnly
) {
  xxx
  
  if (isDef(data) && isPatchable(vnode)) {
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    xxx
  }
      
  xxx
  
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
  }
}
```

在patchVnode中调用了cbs.update，也就调用了directives的update方法。

#### _update

和create一样的入口逻辑。

```js
function _update (oldVnode, vnode) {
  const isCreate = oldVnode === emptyNode
  const isDestroy = vnode === emptyNode
  const oldDirs = normalizeDirectives(oldVnode.data.directives, oldVnode.context)
  const newDirs = normalizeDirectives(vnode.data.directives, vnode.context)

  const dirsWithInsert = []
  const dirsWithPostpatch = []

  let key, oldDir, dir
  for (key in newDirs) {
    xxx
    else {
      // existing directive, update
      dir.oldValue = oldDir.value
      dir.oldArg = oldDir.arg
      callHook(dir, 'update', vnode, oldVnode)
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir)
      }
    }
  }

  xxx

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', () => {
      for (let i = 0; i < dirsWithPostpatch.length; i++) {
        callHook(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode)
      }
    })
  }

  xxx
}
```

将componentUpdated合并到postpatch，和create逻辑差不多，postpatch的调用在patchVnode最后。

# 总结

* v-model本身的逻辑不是很难，一部分在compiler中生成，一部分在自定义指令中处理。对于自定义指令的加载逻辑才是本节的重点。
* 自定义指令的生命周期实际上是vnode的生命周期。

