import { isPlainObject } from './util'

export function transformRequestData (data: any): any {
    if (isPlainObject(data)) {
        return JSON.stringify(data)
    }
    return data
}

export function transformResponseData (data: any) {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data)
        } catch (e) {
            // do nothing
        }
    }
    return data
}
