在mount中第一个重要的部分是`createVnode`，而`createVnode`需要用到component，而component是render和逻辑层的组合，render放后面看，先来看看`defineComponent`

定义在`runtime-core/src/apiDefineComponent`

# 类型

整个文件基本都是类型定义，总共有4个类型定义

## 1

```js
export function defineComponent<Props, RawBindings = object>(
  setup: (
    props: Readonly<Props>,
    ctx: SetupContext
  ) => RawBindings | RenderFunction
): ComponentPublicInstanceConstructor<
  CreateComponentPublicInstance<
    Props,
    RawBindings,
    {},
    {},
    {},
    {},
    {},
    {},
    // public props
    VNodeProps & Props & AllowedComponentProps & ComponentCustomProps
  >
> &
  FunctionalComponent<Props>
```

参数setup是方法，setup返回view层所需数据或者render函数

返回值

### ComponentPublicInstanceConstructor

```js
export type ComponentPublicInstanceConstructor<
  T extends ComponentPublicInstance = ComponentPublicInstance<any>
> = {
  __isFragment?: never
  __isTeleport?: never
  __isSuspense?: never
  new (...args: any[]): T
}
```

`ComponentPublicInstance`在mount章节提到过，定义了组件实例公共方法和属性

返回一个构造函数`ComponentPublicInstanceConstructor`，T为instance的类型，第一个泛型表示的是props，默认为any

### FunctionalComponent

```js
// overload 1: direct setup function
// (uses user defined props interface)
export interface FunctionalComponent<P = {}, E extends EmitsOptions = {}>
  extends ComponentInternalOptions {
  // use of any here is intentional so it can be a valid JSX Element constructor
  (props: P, ctx: SetupContext<E>): any
  props?: ComponentPropsOptions<P>
  emits?: E | (keyof E)[]
  inheritAttrs?: boolean
  displayName?: string
}
```

函数式组件内容先跳过

## 2

```js
// overload 2: object format with no props
// (uses user defined props interface)
// return type is for Vetur and TSX support
export function defineComponent<
  Props = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = Record<string, any>,
  EE extends string = string
>(
  options: ComponentOptionsWithoutProps<
    Props,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE
  >
): ComponentPublicInstanceConstructor<
  CreateComponentPublicInstance<
    Props,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    VNodeProps & Props & AllowedComponentProps & ComponentCustomProps
  >
> &
  ComponentOptionsWithoutProps<
    Props,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE
  >
```

`ComponentPublicInstanceConstructor`上面讲过这里不再赘述，这里重点看`ComponentOptionsWithoutProps`，第二种函数重载对应no props的情况

### ComponentOptionsWithoutProps-start

```js
export type ComponentOptionsWithoutProps<
  Props = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = EmitsOptions,
  EE extends string = string
> = ComponentOptionsBase<Props, RawBindings, D, C, M, Mixin, Extends, E, EE> & {
  props?: undefined
} & ThisType<
    CreateComponentPublicInstance<
      {},
      RawBindings,
      D,
      C,
      M,
      Mixin,
      Extends,
      E,
      Readonly<Props>
    >
  >
```

`ComponentOptionsBase`定义option的基础类型具体可以看`./componentOptions.ts`

这里在原有的基础上扩展了props和this的类型, 并且props为undefined的情况，此时`ThisType`的props也没有类型

这里的props类型有好几种，对应了`vue`的props的用法，具体可以自行了解

### ComponentOptionsWithoutProps-end

第二种函数的重载是对应props的不同用法，这里的props没有定义

## 3

```js
// overload 3: object format with array props declaration
// props inferred as { [key in PropNames]?: any }
// return type is for Vetur and TSX support
export function defineComponent<
  PropNames extends string,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = Record<string, any>,
  EE extends string = string
>(
  options: ComponentOptionsWithArrayProps<
    PropNames,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE
  >
): ComponentPublicInstanceConstructor<
  // array props technically doesn't place any constraints on props in TSX before,
  // but now we can export array props in TSX
  CreateComponentPublicInstance<
    Readonly<{ [key in PropNames]?: any }>,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    AllowedComponentProps & ComponentCustomProps
  >
> &
  ComponentOptionsWithArrayProps<
    PropNames,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE
  >
```

第三种函数的重载是对应props的不同用法，和第二种差不多，这里的props是字符串数组

## 4

```js
// overload 4: object format with object props declaration
// see `ExtractPropTypes` in ./componentProps.ts
export function defineComponent<
  // the Readonly constraint allows TS to treat the type of { required: true }
  // as constant instead of boolean.
  PropsOptions extends Readonly<ComponentPropsOptions>,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = Record<string, any>,
  EE extends string = string
>(
  options: ComponentOptionsWithObjectProps<
    PropsOptions,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE
  >
): ComponentPublicInstanceConstructor<
  CreateComponentPublicInstance<
    ExtractPropTypes<PropsOptions, false>,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    VNodeProps & AllowedComponentProps & ComponentCustomProps
  > &
    Readonly<ExtractPropTypes<PropsOptions>>
> &
  ComponentOptionsWithObjectProps<
    PropsOptions,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE
  >
```

第四种函数重载也是props类型的不同，这里的props是对象



# 实现

```js
export function defineComponent(options: unknown) {
  return isFunction(options) ? { setup: options, name: options.name } : options
}
```

如果是options是函数则自动转成setup函数，否则直接返回options，如果使用`vue template`则在options上会添加render函数



# demo

```js
export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  },
  setup (props) {
    const target = reactive<number[]>([]) as any

    return {
      target,
      test () {
        target['ttt'] = 1
        console.log(target)
      }
    }
  }
})
```

会转换成

```js
{
	components: {HelloWorld: {…}},
  name: "App",
  render: ƒ render(_ctx, _cache),
  setup: ƒ setup(props),
  __emits: [null],
  __file: "src/App.vue"
  __hmrId: "7ba5bd90"
  __props: []
}
```



# 总结

1. `defineComponent`作用是为了更好的利用`typescript`进行类型推导，之所以使用函数而不是类在`Vue3`的[征求意见稿](https://composition-api.vuejs.org/zh/#%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%8E%A8%E5%AF%BC)中给出了很好的解释

