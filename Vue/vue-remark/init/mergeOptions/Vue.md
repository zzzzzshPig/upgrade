> Vue的mergeOptions分为两种，一种是对new Vue的options的处理，一种是对component的options的处理。我们本章节是对Vue的mergeOptions进行解读。

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

> 我们走下面这个分支，在这里我们调用了mergeOptions，在它的参数中我们又调用了resolveConstructorOptions，它定义在本文件中。

```javascript
let options = Ctor.options
if (Ctor.super) {
  xxx
}
return options
```

> 由于new Vue的时候Ctor是没有Super的，所以这里跳过，直接返回了Vue.options，现在我们进入mergeOption，它定义在`utils/options.js`。

```javascript
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object
```

> 它接收三个参数并且返回一个对象，parent是Ctor.options，child是new Vue时候传入的options，vm是可选参数，是当前vm实例。

```javascript
if (process.env.NODE_ENV !== 'production') {
  checkComponents(child)
}

if (typeof child === 'function') {
  child = child.options
}

normalizeProps(child, vm)
normalizeInject(child, vm)
normalizeDirectives(child)
```

> 这些都是一些check和normalize操作，感兴趣的可以看看，这里先跳过。

```javascript
// Apply extends and mixins on the child options,
// but only if it is a raw options object that isn't
// the result of another mergeOptions call.
// Only merged options has the _base property.
if (!child._base) {
  if (child.extends) {
    parent = mergeOptions(parent, child.extends, vm)
  }
  if (child.mixins) {
    for (let i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm)
    }
  }
}
```

> 这里注释是说这个options不能是Vue.options，只有Vue.options才有_base。如果options中定义了extend，那么递归调用mergeOptions，将child.extend做为child传入。mixins和extend的逻辑一样。

```javascript
const options = {}
let key
for (key in parent) {
  mergeField(key)
}
for (key in child) {
  if (!hasOwn(parent, key)) {
    mergeField(key)
  }
}
function mergeField (key) {
  const strat = strats[key] || defaultStrat
  options[key] = strat(parent[key], child[key], vm, key)
}
```

> 这里就是对parent中的options和child中的options进行和并，只有在parent中没有的key，child的中的key才会被合并，这是因为mergeField的实现中对parent和child进行了合并，parent先遍历一次，已经对parent和child进行过合并了，所以只需要在child遍历时候取parent中没有的合并。这里的margeField代码不多，最重要的是strats，他是options下面所有选项的合并策略，它定义在本文件，我们以data的合并策略为例。

```javascript
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function
```

> parentVal是parent.data，childVal是child.data，vm是当前Vue实例。它的返回值的undefined | Function。

```javascript
if (!vm) {
  xxx
}

return mergeDataOrFn(parentVal, childVal, vm)
```

> vm存在，所以我们走mergeDataOrFn(parentVal, childVal, vm)，来看看mergeDataOrFn函数。

```javascript
export function mergeDataOrFn (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
```

> 参数和返回值都和strats.data一样（实际上Strats.data返回的就是它返回的值）。

```javascript
if (!vm) {
  xxx
} else {
  return function mergedInstanceDataFn () {
    // instance merge
    const instanceData = typeof childVal === 'function'
      ? childVal.call(vm, vm)
      : childVal
    const defaultData = typeof parentVal === 'function'
      ? parentVal.call(vm, vm)
      : parentVal
    if (instanceData) {
      return mergeData(instanceData, defaultData)
    } else {
      return defaultData
    }
  }
}
```

> 这里返回一个具名函数，这里分别对childVal和parentVal进行判断，如果是function则调用，否则返回它们。如果parent的options中有data的话就进行合并，没有就直接返回child.options.data，来看一下mergeData。

```javascript
if (!from) return to
let key, toVal, fromVal

const keys = hasSymbol
  ? Reflect.ownKeys(from)
  : Object.keys(from)

for (let i = 0; i < keys.length; i++) {
  key = keys[i]
  // in case the object is already observed...
  if (key === '__ob__') continue
  toVal = to[key]
  fromVal = from[key]
  if (!hasOwn(to, key)) {
    set(to, key, fromVal)
  } else if (
    toVal !== fromVal &&
    isPlainObject(toVal) &&
    isPlainObject(fromVal)
  ) {
    mergeData(toVal, fromVal)
  }
}
return to
```

> 这一段代码是对两边的key进行比较，如果是child.options.data中没有的key，则进行合并，否则如果值是对象（不能是数组，函数等Object的子类型），则递归比较，现在我们回到mergeOptions中。

```javascript
function mergeField (key) {
  const strat = strats[key] || defaultStrat
  options[key] = strat(parent[key], child[key], vm, key)
}
return options
```

> strat中的合并策略是可以自定义的，它是基于config.optionMergeStrategies的，但是只能定义options中以后的选项之外的策略，比如在options中增加了一个role字段。

> 那么这里，我们的mergeOptions就已经讲完了，下一章我们来看一下component的合并策略。