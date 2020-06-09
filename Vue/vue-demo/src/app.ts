import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  testPromise: Promise<any> | null = null

  mounted () {
    this.getData(1)
  }

  changePromise () {
    this.testPromise = Promise.resolve('test')
  }

  getData (status: number) {
    this.testPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (status === 0) {
          reject(new Error('reject promise'))
        } else {
          resolve('hello promise')
        }
      }, 3000)
    })
  }

  testPromiseResolve (data: any) {
    console.log(data)
  }

  testPromiseReject (error: any) {
    console.log(error)
  }
}
