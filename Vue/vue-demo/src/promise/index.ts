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

// 每一次promise变动都会导致uid增加
let uid = 0

@Component
export default class Promised extends Vue {
  @Watch('promise')
  async watchPromise () {
    // 缓存uid 在promise决策后进行判断
    const id = ++uid
    this.refreshStatus()

    // 传入的不是promise则既不resolve 也不reject
    if (!utils.isPromise(this.promise)) {
      return
    }

    try {
      this.showLoading()
      const data = await this.promise

      // id 和 uid不一致 则丢弃掉这次结果 - 因为在pending期间 promise的值发生了变化
      if (id === uid) {
        this.resolvePromise(data)
      }
    } catch (e) {
      if (id === uid) {
        this.rejectPromise(e)
      }
    } finally {
      if (id === uid) {
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
