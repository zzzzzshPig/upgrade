import Cancel from './cancel'

export interface Canceler {
    (message?: string): void
}

interface CancelExecutor {
    (cancel: Canceler): void
}

interface CancelTokenSource {
    token: CancelToken
    cancel: Canceler
}

interface ResolvePromise {
    (reason?: Cancel): void
}

export default class CancelToken {
    promise: Promise<Cancel>
    reason?: Cancel

    throwIfRequested () {
        if (this.reason) {
            throw this.reason
        }
    }

    constructor (executor: CancelExecutor) {
        let resolvePromise: ResolvePromise
        this.promise = new Promise<Cancel>(resolve => {
            resolvePromise = resolve
        })

        executor(message => {
            if (this.reason) {
                return
            }
            this.reason = new Cancel(message)
            resolvePromise(this.reason)
        })
    }

    static source (): CancelTokenSource {
        let cancel!: Canceler
        const token = new CancelToken(c => {
            cancel = c
        })
        return {
            cancel,
            token
        }
    }
}
