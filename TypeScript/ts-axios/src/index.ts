import { AxiosRequestConfig } from './types'
import xhr from './xhr'

/*
这里其实支持两种方式url, config 和 config，暂时只做简单版的
(config: AxiosRequestConfig): AxiosPromise;
(url: string, config?: AxiosRequestConfig): AxiosPromise;
* */
function axios (config: AxiosRequestConfig) {
    xhr(config)
}

export default axios
