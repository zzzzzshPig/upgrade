
export default {
  isPromise (p: any) {
    return Object.prototype.toString.call(p).includes('Promise')
  }
}
