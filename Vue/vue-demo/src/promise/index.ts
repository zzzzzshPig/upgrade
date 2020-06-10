import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import utils from '../utils'

interface PromisedInter {
  status: 0 | 1 | 2; // pending resolve reject
  error?: any;
  data?: any;
}

interface PromiseLoading {
  show: boolean;
  timer: number;
}

type promise = Promise<any> | null
@Component
export default class Promised extends Vue {
  @Watch('promise')
  async watchPromise (promise: promise) {
    this.refreshStatus()

    // 传入的不是promise则既不resolve 也不reject
    if (!utils.isPromise(this.promise)) {
      return
    }

    try {
      this.showLoading()
      const data = await this.promise

      // id 和 uid不一致 则丢弃掉这次结果 - 因为在pending期间 promise的值发生了变化
      if (this.promise === promise) {
        this.resolvePromise(data)
      }
    } catch (e) {
      if (this.promise === promise) {
        this.rejectPromise(e)
      }
    } finally {
      if (this.promise === promise) {
        this.hideLoading()
      }
    }
  }

  @Prop({
    type: Promise,
    default: Promise.resolve()
  })
  promise !: Promise<any>

  @Prop({
    type: Number,
    default: 200
  })
  loadingDelay !: number

  promised: PromisedInter = {
    status: 0,
    error: null,
    data: null
  }

  loading: PromiseLoading = {
    show: false,
    timer: 0
  }

  destroyed () {
    clearTimeout(this.loading.timer)
  }

  resolvePromise (data: any) {
    this.promised.status = 1
    this.promised.data = data

    this.$emit('resolve', data)
  }

  rejectPromise (error: any) {
    this.promised.status = 2
    this.promised.error = error

    this.$emit('reject', error)
  }

  showLoading () {
    this.loading.timer = setTimeout(() => {
      this.loading.show = true
    }, this.loadingDelay)
  }

  hideLoading () {
    clearTimeout(this.loading.timer)
    this.loading = {
      show: false,
      timer: 0
    }
  }

  refreshStatus () {
    this.promised = {
      status: 0,
      error: null,
      data: null
    }

    this.hideLoading()
  }
}
