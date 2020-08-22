export interface AxiosRequestConfig {
    url: string
    headers?: any
    method?: Method
    data?: any
    params?: any
    responseType?: XMLHttpRequestResponseType
    timeout?: number
}

export interface AxiosResponse {
    data: any
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request: any
}

export type AxiosPromise = Promise<AxiosResponse>

export type Method = 'get' | 'GET'
    | 'delete' | 'Delete'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'

export interface BaseFunction {
    (config: AxiosRequestConfig): AxiosPromise

    (url: string, config?: Omit<AxiosRequestConfig, 'url'>): AxiosPromise

    create (): BaseFunction

    request(config: AxiosRequestConfig): AxiosPromise

    get(url: string, config?: AxiosRequestConfig): AxiosPromise

    delete(url: string, config?: AxiosRequestConfig): AxiosPromise

    head(url: string, config?: AxiosRequestConfig): AxiosPromise

    options(url: string, config?: AxiosRequestConfig): AxiosPromise

    post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise

    put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise

    patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
}
