> create分为beforeCreate和created。

> create不区分Vue和component。

```javascript
vm._self = vm
initLifecycle(vm)
initEvents(vm)
initRender(vm)
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
initState(vm)
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')
```

> 在`lifycycle,event,render`被init完之后，调用beforeCreate。可以看到这个时候还没有对`data,props`等做任何处理所以这个时候this是拿不到`data,props`等数据的。然后对响应式数据做一系列的操作之后调用了created，所以这个时候是可以拿到`data,props`等数据的。