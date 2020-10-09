对于components的处理定义在`runtime-core/src/component.ts`

# setupStatefulComponent

```js
if (__DEV__) {
  if (Component.name) {
    validateComponentName(Component.name, instance.appContext.config)
  }
  if (Component.components) {
    const names = Object.keys(Component.components)
    for (let i = 0; i < names.length; i++) {
      validateComponentName(names[i], instance.appContext.config)
    }
  }
  xxx
}
```

在setupStatefulComponent中的这一段对于components的处理是第一步，这一步的作用是检查组件名是否合法，不合法会报错

# setupRenderEffect

内容比较多，只截取相关内容

```js
const subTree = (instance.subTree = renderComponentRoot(instance))
```

这里调用了当前实例的render函数，拿到子节点的树状结构，子节点中有可能包括子组件，此时会resolve此组件，等所有的节点render完毕后，subTree就构造完毕

```js
if (el && hydrateNode) {
  xxx
} else {
  xxx
  patch(
    null,
    subTree,
    container,
    anchor,
    instance,
    parentSuspense,
    isSVG
  )
  xxx
}
```

这里再次调用patch进入子节点的patch流程，此时会对component进行patch最终渲染到页面

# 总结

1. 在options中对于组件的处理不是很多，剩下的未讲的点在父实例的render函数调用时对于子组件的resolve，这一点我们等讲到render的时候再说