import Vue from 'vue'
import App from './App.vue'
import Promised from './promise/index.vue'
import { Promised as Promised2 } from 'vue-promised'

Vue.component('Promised', Promised)
Vue.component('Promised2', Promised2)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
