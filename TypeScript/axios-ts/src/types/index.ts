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
