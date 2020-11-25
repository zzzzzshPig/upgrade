### 类型定义

```tsx
declare const __HMR_PROTOCOL__: string
declare const __HMR_HOSTNAME__: string
declare const __HMR_PORT__: string
declare const __MODE__: string
declare const __DEFINES__: Record<string, any>
;(window as any).process = (window as any).process || {}
;(window as any).process.env = (window as any).process.env || {}
;(window as any).process.env.NODE_ENV = __MODE__

declare var __VUE_HMR_RUNTIME__: HMRRuntime

interface HotModule {
  id: string
  callbacks: HotCallback[]
}

interface HotCallback {
  deps: string | string[]
  fn: (modules: object | object[]) => void
}
```



### `__DEFINES__`

```tsx
const defines = __DEFINES__
Object.keys(defines).forEach((key) => {
  const segs = key.split('.')
  let target = window as any
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i]
    if (i === segs.length - 1) {
      target[seg] = defines[key]
    } else {
      target = target[seg] || (target[seg] = {})
    }
  }
})
```

这里的`__DEFINES__`是通过服务端渲染的时候动态注入的，详情见`node/server/serverPluginClient.ts`



### `__VUE__HMR__RUNTIME`

```tsx
declare var __VUE_HMR_RUNTIME__: HMRRuntime
```

`__VUE_HMR_RUNTIME__`是不存在的，在调用的时候会报错，被`vue`的错误捕捉机制捕捉到，这里不深究



### socket

```tsx
// use server configuration, then fallback to inference
const socketProtocol =
  __HMR_PROTOCOL__ || (location.protocol === 'https:' ? 'wss' : 'ws')
const socketHost = `${__HMR_HOSTNAME__ || location.hostname}:${__HMR_PORT__}`
const socket = new WebSocket(`${socketProtocol}://${socketHost}`, 'vite-hmr')
```

一些socket相关常量，协议，host以及`webSocket`实例



### onMessage

```tsx
// Listen for messages
socket.addEventListener('message', async ({ data }) => {
  const payload = JSON.parse(data) as HMRPayload | MultiUpdatePayload
  if (payload.type === 'multi') {
    payload.updates.forEach(handleMessage)
  } else {
    handleMessage(payload)
  }
})
```

监听`onMessage`，根据不同的type调用对应处理策略



### handleMessage

```tsx
async function handleMessage(payload: HMRPayload) {
  const { path, changeSrcPath, timestamp } = payload as UpdatePayload
  switch (payload.type) {
    case 'connected':
      console.log(`[vite] connected.`)
      break
    case 'vue-reload':
      queueUpdate(
        import(`${path}?t=${timestamp}`)
          .catch((err) => warnFailedFetch(err, path))
          .then((m) => () => {
            __VUE_HMR_RUNTIME__.reload(path, m.default)
            console.log(`[vite] ${path} reloaded.`)
          })
      )
      break
    case 'vue-rerender':
      const templatePath = `${path}?type=template`
      import(`${templatePath}&t=${timestamp}`).then((m) => {
        __VUE_HMR_RUNTIME__.rerender(path, m.render)
        console.log(`[vite] ${path} template updated.`)
      })
      break
    case 'style-update':
      // check if this is referenced in html via <link>
      const el = document.querySelector(`link[href*='${path}']`)
      if (el) {
        el.setAttribute(
          'href',
          `${path}${path.includes('?') ? '&' : '?'}t=${timestamp}`
        )
        break
      }
      // imported CSS
      const importQuery = path.includes('?') ? '&import' : '?import'
      await import(`${path}${importQuery}&t=${timestamp}`)
      console.log(`[vite] ${path} updated.`)
      break
    case 'style-remove':
      removeStyle(payload.id)
      break
    case 'js-update':
      queueUpdate(updateModule(path, changeSrcPath, timestamp))
      break
    case 'custom':
      const cbs = customUpdateMap.get(payload.id)
      if (cbs) {
        cbs.forEach((cb) => cb(payload.customData))
      }
      break
    case 'full-reload':
      if (path.endsWith('.html')) {
        // if html file is edited, only reload the page if the browser is
        // currently on that page.
        const pagePath = location.pathname
        if (
          pagePath === path ||
          (pagePath.endsWith('/') && pagePath + 'index.html' === path)
        ) {
          location.reload()
        }
        return
      } else {
        location.reload()
      }
  }
}
```

根据不同的type处理对应的文件的update或者reload，这里作用就是监听内容变化实现热更新，具体处理方法不深入



### updateModule

```tsx
async function updateModule(
  id: string,
  changedPath: string,
  timestamp: number
) {
  const mod = hotModulesMap.get(id)
  if (!mod) {
    // In a code-spliting project,
    // it is common that the hot-updating module is not loaded yet.
    // https://github.com/vitejs/vite/issues/721
    return
  }

  const moduleMap = new Map()
  const isSelfUpdate = id === changedPath

  // make sure we only import each dep once
  const modulesToUpdate = new Set<string>()
  if (isSelfUpdate) {
    // self update - only update self
    modulesToUpdate.add(id)
  } else {
    // dep update
    for (const { deps } of mod.callbacks) {
      if (Array.isArray(deps)) {
        deps.forEach((dep) => modulesToUpdate.add(dep))
      } else {
        modulesToUpdate.add(deps)
      }
    }
  }

  // determine the qualified callbacks before we re-import the modules
  const callbacks = mod.callbacks.filter(({ deps }) => {
    return Array.isArray(deps)
      ? deps.some((dep) => modulesToUpdate.has(dep))
      : modulesToUpdate.has(deps)
  })

  await Promise.all(
    Array.from(modulesToUpdate).map(async (dep) => {
      const disposer = disposeMap.get(dep)
      if (disposer) await disposer(dataMap.get(dep))
      try {
        const newMod = await import(
          dep + (dep.includes('?') ? '&' : '?') + `t=${timestamp}`
        )
        moduleMap.set(dep, newMod)
      } catch (e) {
        warnFailedFetch(e, dep)
      }
    })
  )

  return () => {
    for (const { deps, fn } of callbacks) {
      if (Array.isArray(deps)) {
        fn(deps.map((dep) => moduleMap.get(dep)))
      } else {
        fn(moduleMap.get(deps))
      }
    }

    console.log(`[vite]: js module hot updated: `, id)
  }
}
```

更新引入的modules



### onClose

```tsx
// ping server
socket.addEventListener('close', () => {
  console.log(`[vite] server connection lost. polling for restart...`)
  setInterval(() => {
    fetch('/')
      .then(() => {
        location.reload()
      })
      .catch((e) => {
        /* ignore */
      })
  }, 1000)
})
```

链接被关闭的一秒钟后刷新页面尝试重新连接



### Style

```tsx
// https://wicg.github.io/construct-stylesheets
const supportsConstructedSheet = (() => {
  try {
    new CSSStyleSheet()
    return true
  } catch (e) {}
  return false
})()
```

是否支持构造`cssStyleSheet`，如果支持即使用`new CSSStyleSheet`来创建`style`，不支持创建`style dom`

```tsx
const sheetsMap = new Map()
```

用来缓存`style`



### updateStyle

```tsx
export function updateStyle(id: string, content: string) {
  let style = sheetsMap.get(id)
  if (supportsConstructedSheet && !content.includes('@import')) {
    if (style && !(style instanceof CSSStyleSheet)) {
      removeStyle(id)
      style = undefined
    }

    if (!style) {
      style = new CSSStyleSheet()
      style.replaceSync(content)
      // @ts-ignore
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, style]
    } else {
      style.replaceSync(content)
    }
  } else {
    if (style && !(style instanceof HTMLStyleElement)) {
      removeStyle(id)
      style = undefined
    }

    if (!style) {
      style = document.createElement('style')
      style.setAttribute('type', 'text/css')
      style.innerHTML = content
      document.head.appendChild(style)
    } else {
      style.innerHTML = content
    }
  }
  sheetsMap.set(id, style)
}
```

根据`supportsConstructedSheet`来决定使用什么方式创建和更新`style`



### removeStyle

```tsx
function removeStyle(id: string) {
  let style = sheetsMap.get(id)
  if (style) {
    if (style instanceof CSSStyleSheet) {
      // @ts-ignore
      const index = document.adoptedStyleSheets.indexOf(style)
      // @ts-ignore
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
        (s: CSSStyleSheet) => s !== style
      )
    } else {
      document.head.removeChild(style)
    }
    sheetsMap.delete(id)
  }
}
```

根据id删除掉对应的style，不同的style对应不同的删除方式