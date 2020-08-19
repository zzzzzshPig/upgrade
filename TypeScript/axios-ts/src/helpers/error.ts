import { AxiosRequestConfig, AxiosResponse } from '../types/index'

export class AxiosError extends Error {
    isAxiosError: boolean
    config: AxiosRequestConfig
    code?: string
    request?: any
    response: AxiosResponse | null

    constructor (
        message: string,
        config: AxiosRequestConfig,
        code?: string,
        request?: any,
        response?: AxiosResponse
    ) {
        super(message)

        this.config = config
        this.code = code
        this.request = request
        this.response = response || null
        this.isAxiosError = true

        // fix typescript extend raw Object bug
        Object.setPrototypeOf(this, AxiosError.prototype)
    }
}

export function createError (
    message: string,
    config: AxiosRequestConfig,
    code?: string,
    request?: any,
    response?: AxiosResponse
): AxiosError {
    return new AxiosError(message, config, code, request, response)
}
