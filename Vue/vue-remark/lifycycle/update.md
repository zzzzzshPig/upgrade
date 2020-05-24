> update分为beforeUpdate和updated。

> update涉及到watcher相关的很多代码，这次只讨论部分。

> update不区分Vue和component。

### beforeUpdate

> 这个比较简单，我们把代码切到`instance/lifecycle.js`中的mountComponent函数的最下面。

```javascript
new Watcher(vm, updateComponent, noop, {
  before () {
    if (vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'beforeUpdate')
    }
  }
}, true /* isRenderWatcher */)
```

> Watcher的内部实现我们不细看，大致上说一下，在响应式数据发生变化的时候Watcher会调用flushSchedulerQueue方法，这个方法里面会调用这个before函数，然后callHook(vm, 'beforeUpdate')。



### updated

> 这个涉及到Watch的很多知识，我们先跳过其中的一部分，只看flushSchedulerQueue方法，它定义在`observe/scheduler.js`中。

```javascript
xxxx
const updatedQueue = queue.slice()

resetSchedulerState()

// call component updated and activated hooks
callActivatedHooks(activatedQueue)
callUpdatedHooks(updatedQueue)
```

> 简单说下这个queue，它是用来收集数据发生变化的watch的一个队列，updatedQueue是创建了一个queue的副本。最后一句callUpdatedHooks(updatedQueue)是updated被调用的关键，它定义在本文件中。

```javascript
let i = queue.length
while (i--) {
  const watcher = queue[i]
  const vm = watcher.vm
  if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
    callHook(vm, 'updated')
  }
}
```

> 这里会对queue中的每一个watch实例遍历，对watch.vm（vue实例）进行判断，这个判断是判断这个watch是不是渲染watch（也就是在$mount最后的new Watcher），在组件还没有被销毁前并且已经被mounted（patch到html中）才会调用callHook(vm, 'updated')。