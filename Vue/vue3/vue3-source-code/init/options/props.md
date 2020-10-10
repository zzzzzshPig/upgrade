对于props的处理定义在`runtime-core/src/component.ts`

# createComponentInstance

```js
export function createComponentInstance(
  vnode: VNode,
  parent: ComponentInternalInstance | null,
  suspense: SuspenseBoundary | null
) {
  const type = vnode.type as ConcreteComponent
  // inherit parent app context - or - if root, adopt from root vnode
  const appContext =
    (parent ? parent.appContext : vnode.appContext) || emptyAppContext

  const instance: ComponentInternalInstance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null!, // to be immediately set
    next: null,
    subTree: null!, // will be set synchronously right after creation
    update: null!, // will be set synchronously right after creation
    render: null,
    proxy: null,
    withProxy: null,
    effects: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null!,
    renderCache: [],

    // local resovled assets
    components: null,
    directives: null,

    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),

    // emit
    emit: null as any, // to be set immediately
    emitted: null,

    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,

    // suspense related
    suspense,
    asyncDep: null,
    asyncResolved: false,

    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null
  }
  if (__DEV__) {
    instance.ctx = createRenderContext(instance)
  } else {
    instance.ctx = { _: instance }
  }
  instance.root = parent ? parent.root : instance
  instance.emit = emit.bind(null, instance)

  if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
    devtoolsComponentAdded(instance)
  }

  return instance
}
```

重点在

```js
propsOptions: normalizePropsOptions(type, appContext),
```

## normalizePropsOptions

一段一段的看

```js
const appId = appContext.app ? appContext.app._uid : -1
const cache = comp.__props || (comp.__props = {})
const cached = cache[appId]
if (cached) {
  return cached
}
```

这是一段缓存处理，和comp的__props属性相关

```js
const raw = comp.props
const normalized: NormalizedPropsOptions[0] = {}
const needCastKeys: NormalizedPropsOptions[1] = []
```

raw是组件中定义的props

normalized是用来放处理后的props的

```js
// apply mixin/extends props
let hasExtends = false
if (__FEATURE_OPTIONS_API__ && !isFunction(comp)) {
  const extendProps = (raw: ComponentOptions) => {
    hasExtends = true
    const [props, keys] = normalizePropsOptions(raw, appContext, true)
    extend(normalized, props)
    if (keys) needCastKeys.push(...keys)
  }
  if (!asMixin && appContext.mixins.length) {
    appContext.mixins.forEach(extendProps)
  }
  if (comp.extends) {
    extendProps(comp.extends)
  }
  if (comp.mixins) {
    comp.mixins.forEach(extendProps)
  }
}
```

这一段对于props 的处理主要是兼容vue2.x的，在vue3.0中不建议使用mixins和extend，这一段跳过感兴趣的可以看一下

```js
if (!raw && !hasExtends) {
  return (cache[appId] = EMPTY_ARR)
}
```

不存在props的情况，直接缓存空数组然后返回

```js
if (isArray(raw)) {
  for (let i = 0; i < raw.length; i++) {
    if (__DEV__ && !isString(raw[i])) {
      warn(`props must be strings when using array syntax.`, raw[i])
    }
    const normalizedKey = camelize(raw[i])
    if (validatePropName(normalizedKey)) {
      normalized[normalizedKey] = EMPTY_OBJ
    }
  }
}
```

对于props是数组的情况，只允许数组的元素是字符串，并且会把类似于`'a-b'`这样的字符串转成`'aB'`，然后检测是否合法，对合法的字符串对其转换成`{aB: {}}`这种格式

```js
else if (raw) {
  if (__DEV__ && !isObject(raw)) {
    warn(`invalid props options`, raw)
  }
  for (const key in raw) {
    const normalizedKey = camelize(key)
    if (validatePropName(normalizedKey)) {
      const opt = raw[key]
      const prop: NormalizedProp = (normalized[normalizedKey] =
        isArray(opt) || isFunction(opt) ? { type: opt } : opt)
      if (prop) {
        const booleanIndex = getTypeIndex(Boolean, prop.type)
        const stringIndex = getTypeIndex(String, prop.type)
        prop[BooleanFlags.shouldCast] = booleanIndex > -1
        prop[BooleanFlags.shouldCastTrue] =
          stringIndex < 0 || booleanIndex < stringIndex
        // if the prop needs boolean casting or default value
        if (booleanIndex > -1 || hasOwn(prop, 'default')) {
          needCastKeys.push(normalizedKey)
        }
      }
    }
  }
}
```

对props是对象的情况进行处理，同样的`camelize(key)`和`validatePropName(normalizedKey)`

`if(prop)`判断中的代码会对prop插入[0, 1]两个属性，用来标识Boolean和String的情况

```js
return (cache[appId] = [normalized, needCastKeys])
```

最后缓存并返回结果