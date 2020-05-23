> Vue的mergeOptions分为两种，一种是对new Vue的options的处理，一种是对component的options的处理。我们本章节是对Component的mergeOptions进行解读。

> 对于options的处理定义在`instance/init.js`中的initMixin方法。

```javascript
if (options && options._isComponent) {
  // optimize internal component instantiation
  // since dynamic options merging is pretty slow, and none of the
  // internal component options needs special treatment.
  initInternalComponent(vm, options)
} else {
  vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
  )
}
```

> 因为目前处理的是component所以我们会调用initInternalComponent，它定义在当前文件中。

```javascript
const opts = vm.$options = Object.create(vm.constructor.options)
// doing this because it's faster than dynamic enumeration.
const parentVnode = options._parentVnode
opts.parent = options.parent
opts._parentVnode = parentVnode

const vnodeComponentOptions = parentVnode.componentOptions
opts.propsData = vnodeComponentOptions.propsData
opts._parentListeners = vnodeComponentOptions.listeners
opts._renderChildren = vnodeComponentOptions.children
opts._componentTag = vnodeComponentOptions.tag

if (options.render) {
  opts.render = options.render
  opts.staticRenderFns = options.staticRenderFns
}
```

> 这里就非常简单的对后面需要用到的数据进行初始化了，可以看到都是赋值操作没有什么check和normalize操作，vm.constructor.options的定义在`global-api/extend.js`。

```javascript
Sub.options = mergeOptions(
  Super.options,
  extendOptions
)
```

> 那么到这里我们就明白了为什么在_init中需要区分component和Vue实例的mergeOptions了，因为在extend.js中已经merge过了。

> 虽然在_init函数中，Vue实例和component调用的init options的方法不同，但是component和Vue实例都是调用mergeOptions，没有什么本质上的区别，那么下一节我们再看看Mixin中的mergeOptions。