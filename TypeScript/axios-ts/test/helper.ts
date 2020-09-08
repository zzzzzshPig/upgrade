export function getAjaxRequest (): Promise<JasmineAjaxRequest> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(jasmine.Ajax.requests.mostRecent())
        }, 0)
    })
}
