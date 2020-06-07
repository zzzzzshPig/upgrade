> `nextTick`定义在`utils/next-tick.js`，只有一百多行代码。

```javascript
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

> 这段代码很简单，定义了一个回调函数数组然后每个传入的回调都放入数组，最后如果当前没有在执行队列则调用`timerFunc`即可。
>
> 为什么要使用匿名函数来调用回调，是因为`Js`是单线程，如果出错会阻止后续代码执行所以需要用`try-catch`进行捕捉避免错误影响到主线程。
>
> 在`cb`没有传入的时候直接返回一个`promise`，这里是`nextTick`的另一种用法。然后在执行到这个callbacks对应的回调时候调用`_resolve`（_resolve = resolve）。
>
> 上面代码最重要的一部分在`timerFunc`，这个是调用回调函数的地方，它的定义比较复杂，有hack部分。

### micro task

#### promise

```javascript
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
}
```

> 这里如果当前运行环境支持promise的话就用promise处理Events。这里有个兼容，在`IOS`的`UIWebViews`中Promise不能及时的调用，所以使用`setTimeout`强制调用。

#### MutationObserver

```javascript
if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
}
```

> counter是用来触发更新的，这里使用`MutationObserver`监听`textNode`的变化然后调用`flushCallbacks`。`timerFunc`在这里做为触发更新的方法。

#### macro task

#### setImmediate

```javascript
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
}
```

> 浏览器支持`setImmediate`则使用，他会在当前时间队列执行完毕后立即调用用于取代`setTimeout(fn, 0)`。

#### setTimeout

```javascript
} else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```

> 最后采用`setTimeout`，这个做为保底（瞧不起我`setTimeout`?）。

PS: 这里涉及到`microTask`（微任务）和`macroTask`（宏任务），具体可以参考http://www.ruanyifeng.com/blog/2018/02/node-event-loop.html。

> 最后就是调用回调的地方`flushCallbacks`。

```javascript
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```

> 一个简单的调用函数的地方，这里因为是同步的所以可以直接将pending设为false。

### 案例

> 下面的代码是示例。

```javascript
<template>
  <div id="app">
    <div ref="msg">
      {{msg}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      msg: 'hello World'
    }
  }
}
</script>
```

```javascript
mounted () {
    this.msg = 'hello Vue'
    console.log('nextTick1', this.$refs.msg.innerText)
    
    this.$nextTick(() => {
        console.log('nextTick1', this.$refs.msg.innerText)
    })

    this.$nextTick().then(() => {
        console.log('nextTick1', this.$refs.msg.innerText)
    })
}
```

```javascript
mounted () {
    this.$nextTick(() => {
        console.log('nextTick1', this.$refs.msg.innerText)
    })

    this.msg = 'hello Vue'
    console.log('nextTick1', this.$refs.msg.innerText)

    this.$nextTick().then(() => {
        console.log('nextTick1', this.$refs.msg.innerText)
    })
}
```

> 以上两个案例会打印出什么呢？

### 总结

1. `nextTick`是把要执行的任务推入到一个队列中，在下一个Tick中同步执行。
2. 派发更新实际上也是使用`nextTick`在下一个Tick中进行更新。



