keep-alive没有compiler阶段，所以把它当成一个内置组件看就可以了。keep-alive组件不是平台相关的组件，所以放在了`core/components/keep-alive`。

我们用组件的生命周期执行顺序来解析keep-alive。

# created

```js
created () {
  this.cache = Object.create(null)
  this.keys = []
}
```

这里就初始化了cache和keys，可以推测大部分的操作和这两个数据有关，这里的数据定义类似于class的constructor，在created生命周期内初始化数据，对ts的兼容不太好。

# render

组件的render函数，最后返回vnode即可

```js
const slot = this.$slots.default
const vnode: VNode = getFirstComponentChild(slot)
const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
```

首先拿到keep-alive的子节点，这里是因为`<keep-alive>` 要求同时只有一个子元素被渲染所以直接去default即可。没有componentOptions即是普通的节点，直接渲染即可，所以这里我们只用讨论componentOptions存在的情况。

```js
const name: ?string = getComponentName(componentOptions)
const { include, exclude } = this
if (
  // not included
  (include && (!name || !matches(include, name))) ||
  // excluded
  (exclude && name && matches(exclude, name))
) {
  return vnode
}
```

处理included和excluded，这里看一下matches。

## matches-start

```js
function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}
```

pattern类型不一样对于的处理不一样，数组对应精准匹配，字符串对应精准匹配，正则则是自定义匹配

## matches-end

```js
const { cache, keys } = this
const key: ?string = vnode.key == null
  // same constructor may get registered as different local components
  // so cid alone is not enough (#3269)
  ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
  : vnode.key
```

这里是对组件的key进行处理，如果没有写则取组件cid + ::组件名

```js
if (cache[key]) {
  vnode.componentInstance = cache[key].componentInstance
  // make current key freshest
  remove(keys, key)
  keys.push(key)
}
```

当key对应的组件已经缓存的时候，替换当前vnode的componentInstance，这里相当于把vnode当成了一个壳。接下来的remove，keys的操作对应到max prop的一个特性

> 最多可以缓存多少组件实例。一旦这个数字达到了，在新实例被创建之前，已缓存组件中最久没有被访问的实例会被销毁掉。

先从数组中remove然后再push到最后，始终保持用过的在最后，销毁最前的元素即可达到max的特性。

```js
 else {
  cache[key] = vnode
  keys.push(key)
  // prune oldest entry
  if (this.max && keys.length > parseInt(this.max)) {
    pruneCacheEntry(cache, keys[0], keys, this._vnode)
  }
}
```

key对于的组件不存在的时候，则缓存这个组件。当缓存的组件超过了max的限制的时候会调用pruneCacheEntry。

## pruneCacheEntry-start

四个参数分别是cache，keys[0]（需要被删掉的），keys和当前组件的vnode

```js
function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}
```

如果当前删除的组件不是当前正在用的组件则destroy组件，否则仅仅是删除掉cache和keys，再下次使用的时候还会继续缓存。

## pruneCacheEntry-end

```js
vnode.data.keepAlive = true
```

标识组件是keepAlive组件

# mounted

```js
mounted () {
  this.$watch('include', val => {
    pruneCache(this, name => matches(val, name))
  })
  this.$watch('exclude', val => {
    pruneCache(this, name => !matches(val, name))
  })
}
```

监听include和exclude的变化，调用pruneCache

## pruneCache

```js
function pruneCache (keepAliveInstance: any, filter: Function) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode: ?VNode = cache[key]
    if (cachedNode) {
      const name: ?string = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}
```

这里就是对include和exclude的变化进行相应的删除缓存和组件的操作

# destroyed

```js
destroyed () {
  for (const key in this.cache) {
    pruneCacheEntry(this.cache, key, this.keys)
  }
}
```

这里就是清除掉所有缓存，释放内存

# 总结

1. keep-alive本质上是一个内置组件
2. keep-alive是对vnode进行的操作，所以是基础组件，和平台无关
3. keep-alive只支持单个组件，实际上是把这个组件当成了一个壳子