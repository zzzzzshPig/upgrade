# run

服务开启部分定义在`node/cli.ts`

```tsx
;(async () => {
  const { help, h, mode, m, version, v } = argv

  if (help || h) {
    logHelp()
    return
  } else if (version || v) {
    // noop, already logged
    return
  }

  const envMode = mode || m || defaultMode
  const options = await resolveOptions(envMode)
  process.env.NODE_ENV = process.env.NODE_ENV || envMode
  if (!options.command || options.command === 'serve') {
    runServe(options)
  } else if (options.command === 'build') {
    runBuild(options)
  } else if (options.command === 'optimize') {
    runOptimize(options)
  } else {
    console.error(chalk.red(`unknown command: ${options.command}`))
    process.exit(1)
  }
})()
```

当执行`npm run serve`时候会执行`runServe`，从而开启服务



## runServe

```tsx
function runServe(options: UserConfig) {
  const server = require('./server').createServer(options)

  let port = options.port || 3000
  let hostname = options.hostname || 'localhost'
  const protocol = options.https ? 'https' : 'http'

  server.on('error', (e: Error & { code?: string }) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying another one...`)
      setTimeout(() => {
        server.close()
        server.listen(++port)
      }, 100)
    } else {
      console.error(chalk.red(`[vite] server error:`))
      console.error(e)
    }
  })

  server.listen(port, () => {
    console.log()
    console.log(`  Dev server running at:`)
    const interfaces = os.networkInterfaces()
    Object.keys(interfaces).forEach((key) => {
      ;(interfaces[key] || [])
        .filter((details) => details.family === 'IPv4')
        .map((detail) => {
          return {
            type: detail.address.includes('127.0.0.1')
              ? 'Local:   '
              : 'Network: ',
            host: detail.address.replace('127.0.0.1', hostname)
          }
        })
        .forEach(({ type, host }) => {
          const url = `${protocol}://${host}:${chalk.bold(port)}/`
          console.log(`  > ${type} ${chalk.cyan(url)}`)
        })
    })
    console.log()
    require('debug')('vite:server')(`server ready in ${Date.now() - start}ms.`)

    if (options.open) {
      require('./utils/openBrowser').openBrowser(
        `${protocol}://${hostname}:${port}`
      )
    }
  })
}
```

通过createServer创建http服务然后监听端口开启服务器，开启服务器后自动打开浏览器，如果发生`EADDRINUSE`错误则不断尝试重连



# createServer

服务器的内容主要是在`node/server/index.ts`

## 类型定义

```tsx
export type ServerPlugin = (ctx: ServerPluginContext) => void

export interface ServerPluginContext {
  root: string
  app: Koa<State, Context>
  server: Server
  watcher: HMRWatcher
  resolver: InternalResolver
  config: ServerConfig & { __path?: string }
  port: number
}

export interface State extends DefaultState {}

export type Context = DefaultContext &
  ServerPluginContext & {
    read: (filePath: string) => Promise<Buffer | string>
    map?: SourceMap | null
  }
```



## createServer

`createServer`内容比较长我们分开看

```tsx
const {
  root = process.cwd(),
  configureServer = [],
  resolvers = [],
  alias = {},
  transforms = [],
  vueCustomBlockTransforms = {},
  optimizeDeps = {},
  enableEsbuild = true,
  assetsInclude
} = config

const app = new Koa<State, Context>()
const server = resolveServer(config, app.callback())
const watcher = chokidar.watch(root, {
  ignored: [/node_modules/, /\.git/],
  // #610
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 10
  }
}) as HMRWatcher
const resolver = createResolver(root, resolvers, alias, assetsInclude)

const context: ServerPluginContext = {
  root,
  app,
  server,
  watcher,
  resolver,
  config,
  // port is exposed on the context for hmr client connection
  // in case the files are served under a different port
  port: config.port || 3000
}
```

读取vite的配置项后，使用Koa创建实例，调用resolveServer创建对应的https或者http服务，默认是http。解这便创建watcher，用来监听文件变动，然后创建resolver加载器，用来加载各种资源

```tsx
// attach server context to koa context
app.use((ctx, next) => {
  Object.assign(ctx, context)
  ctx.read = cachedRead.bind(null, ctx)
  return next()
}
```

使用中间件，针对缓存做处理

```tsx
// cors
if (config.cors) {
  app.use(
    require('@koa/cors')(typeof config.cors === 'boolean' ? {} : config.cors)
  )
}
```

针对跨域进行处理，调用的是`@koa/cors`包

```tsx
const resolvedPlugins = [
  // rewrite and source map plugins take highest priority and should be run
  // after all other middlewares have finished
  sourceMapPlugin,
  moduleRewritePlugin,
  htmlRewritePlugin,
  // user plugins
  ...toArray(configureServer),
  envPlugin,
  moduleResolvePlugin,
  proxyPlugin,
  clientPlugin,
  hmrPlugin,
  ...(transforms.length || Object.keys(vueCustomBlockTransforms).length
    ? [
        createServerTransformPlugin(
          transforms,
          vueCustomBlockTransforms,
          resolver
        )
      ]
    : []),
  vuePlugin,
  cssPlugin,
  enableEsbuild ? esbuildPlugin : null,
  jsonPlugin,
  assetPathPlugin,
  webWorkerPlugin,
  wasmPlugin,
  serveStaticPlugin
]
resolvedPlugins.forEach((m) => m && m(context))
```

加载插件的逻辑，实际上是调用所用的插件然后将之前定义好的context传入，插件的具体逻辑以后再看

```tsx
const listen = server.listen.bind(server)
server.listen = (async (port: number, ...args: any[]) => {
  if (optimizeDeps.auto !== false) {
    await require('../optimizer').optimizeDeps(config)
  }
  return listen(port, ...args)
}) as any

server.once('listening', () => {
  context.port = (server.address() as AddressInfo).port
})

return server
```

代理listen并进行代码优化，压缩，清除无用代码减小体积

### resolveServer

```tsx
function resolveServer(
  { https = false, httpsOptions = {}, proxy }: ServerConfig,
  requestListener: RequestListener
): Server {
  if (https) {
    if (proxy) {
      // #484 fallback to http1 when proxy is needed.
      return require('https').createServer(
        resolveHttpsConfig(httpsOptions),
        requestListener
      )
    } else {
      return require('http2').createSecureServer(
        {
          ...resolveHttpsConfig(httpsOptions),
          allowHTTP1: true
        },
        requestListener
      )
    }
  } else {
    return require('http').createServer(requestListener)
  }
}
```

如果是https则启动https服务，否则启动http服务，默认是http



# 总结

启动服务比较简单，服务启动完毕之后接下来就是等请求的到来，对于插件的讲解要分为很多模块，因为vite的plugin有很多，我们慢慢的看