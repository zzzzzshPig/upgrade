### vm.data的访问

```
new Vue({
	mounted () {
		console.log(this.msg)
	},
	data () {
		return {
			msg: 'hello Vue!'
		}
	}
})
```

> 在以上代码中，我们访问了vm.msg，那么其实我们的msg是在data下的，我们是怎么通过vm.msg访问到data.msg的呢？在initMixin中的initState函数中，对data进行了处理。

```
if (opts.data) {
	initData(vm)
} else {
	observe(vm._data = {}, true /* asRootData */)
}
```

> 这里分析一下initData

```
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
```

> 首先是对data是function进行处理

```
export function getData (data: Function, vm: Component): any {
  // #7573 disable dep collection when invoking data getters
  pushTarget()
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`)
    return {}
  } finally {
    popTarget()
  }
}
```

> 然后对data的key进行一次遍历，不允许key和methods,props的重复，因为这些key都可以通过this访问，所以不能重名。

```
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
```

> 重点看proxy

```
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

> 这段代码将data下面的key和value挂载到了`this`下，同时将`this[key]`代理到`this[sourceKey][key]`，使得修改`this[xxx]`相当于修改`this._data[xxx]`，获取`this[xxx]`相当于获取`this._data[xxx]`，保证了data与_data的映射关系，对data的操作实际上是操作_data。
