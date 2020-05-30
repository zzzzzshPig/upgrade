> promise式组件和工厂函数式组件基本一致，主要是为了配合import函数进行使用，import函数会返回一个promise，具体使用方法如下。

```javascript
components: {
  myComponent: () => import('./cccc.vue')
},
```

> 在`resolve-async-component.js`中，最后面有一个判断。`resolve-async-component.js`定义在`vdom/helpers/resolve-async-component.js`。

```javascript
if (isObject(res)) {
  if (isPromise(res)) {
    // () => Promise
    if (isUndef(factory.resolved)) {
      res.then(resolve, reject)
    }
  } else if (isPromise(res.component)) {
    xxx
  }
}
```

> 这里对`factory(resolve, reject)`的返回值进行判断，如果返回的是对象并且是promise并且没有被resolve过就.then等待resolve。`else if (isPromise(res.component))`这里是对高级组件的判断暂时不看。后续的调用流程和工厂函数一致这里就不再赘述。

> 那么到这里promise的执行过程就已经看完了，下面我们将看高级组件的生成过程。