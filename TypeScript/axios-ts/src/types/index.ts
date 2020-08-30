import InterceptorManager from '@/core/interceptor'

export interface AxiosRequestConfig {
    [propName: string]: any
    url?: string
    headers?: any
    method?: Method
    data?: any
    params?: any
    responseType?: XMLHttpRequestResponseType
    timeout?: number
    transformRequest?: AxiosTransformer | AxiosTransformer[]
    transformResponse?: AxiosTransformer | AxiosTransformer[]
}

export interface AxiosTransformer {
    (data: any, headers?: any): any
}

export interface AxiosResponse<T = any> {
    data: T
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request: any
}

export type AxiosPromise<T = any> = Promise<AxiosResponse<T>>

export type Method = 'get' | 'GET'
    | 'delete' | 'Delete'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'

export interface AxiosInterceptorManager<T> {
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

    eject(id: number): void
}

export interface ResolvedFn<T=any> {
    (val: T): T | Promise<T>
}

export interface RejectedFn {
    (error: any): any
}

interface Interceptors {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
}

export interface BaseFunction {
    <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

    <T = any>(url: string, config?: Omit<AxiosRequestConfig, 'url'>): AxiosPromise<T>

    defaults: AxiosRequestConfig

    interceptors: Interceptors

    create (config?: AxiosRequestConfig): BaseFunction

    request <T = any> (config: AxiosRequestConfig): AxiosPromise<T>

    get <T = any> (url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    delete <T = any> (url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    head <T = any> (url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    options <T = any> (url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    post <T = any> (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

    put <T = any> (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

    patch <T = any> (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}
