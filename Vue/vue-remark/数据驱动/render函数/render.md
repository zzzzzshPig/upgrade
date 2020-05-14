> 这一节我们来看看上一节解读过程中跳过的一个内容`vm_render`。

```javascript
updateComponent = () => {
    vm._update(vm._render(), hydrating)
}
```

> `_render`的定义在`instance/render.js`的`renderMixin`方法中，该方法在`instance/index.js`中调用。

```javascript
 const { render, _parentVnode } = vm.$options
```

> 该方法是从`$options`中所取，也就是说这个方法要么是自己写的`render`函数，要么是根据`template`生成的`render`函数。

```javascript
vnode = render.call(vm._renderProxy, vm.$createElement)
```

> 首先我们来看这个`vm._renderProxy`，定义在`instance/init.js`中的`initMixin`方法。

```javascript
if (process.env.NODE_ENV !== 'production') {
    initProxy(vm)
} else {
    vm._renderProxy = vm
}
```

> 在生产环境中指的其实是`Vue`实例，重点看`initProxy`，定义在`instance/proxy.js`。

```javascript
initProxy = function initProxy (vm) {
  if (hasProxy) {
    // determine which proxy handler to use
    const options = vm.$options
    const handlers = options.render && options.render._withStripped
      ? getHandler
      : hasHandler
    vm._renderProxy = new Proxy(vm, handlers)
  } else {
    vm._renderProxy = vm
  }
}
```

> `hasProxy`主要是判断是否支持`ES6-proxy`，默认支持。`handlers`这个变量会是`hasHandler`，因为只有在`test case`中` options.render._withStripped`才为`true`，具体可以看`test/xxx/render-proxy-spec.js`，这里不作讨论。

```javascript
const hasHandler = {
  has (target, key) {
    const has = key in target
    const isAllowed = allowedGlobals(key) ||
      (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data))
    if (!has && !isAllowed) {
      if (key in target.$data) warnReservedPrefix(target, key)
      else warnNonPresent(target, key)
    }
    return has || !isAllowed
  }
}
```

> 这里主要是对传入的`data,methods,props`等进行一次检查，不合格的进行报错。

```javascript
vm._renderProxy = new Proxy(vm, handlers)
```

> 然后进行代理。我们现在已经走完了`vm._renderProxy`现在回到`render.js`中来，看看第二个参数`vm.$createElement`，它定义在本文件中，该方法主要是给自定义的`render`函数用的，具体我们不细看。

```javascript
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
```

> 我们写个demo看看这个东东是啥就行了。

```javascript
export default {
    name: 'HelloWorld',
    props: {
        msg: String
    },
    render (h) {
        return h('div', {
            attrs: {
                className: 'helloComponent'
            }
        }, this.msg)
    }
}
```

> 相当于

```vue
<div class="helloComponent">
	{{msg}}
</div>
```

> 这里我发现一个东西，就是在`.vue`文件中如果有`template`的话`render`函数就无效，应该是优先`template`。`render`函数中的`h`参数就是`$createElement`了。



> 实际上我们通过`render`生成了`vNode`，然后再对`vNode`进行一系列的处理生成实际`dom`然后`patch`到`html`中。那么下一节我们就来看看这个生成的`vNode(virtual Dom)`虚拟节点是何方神圣。

