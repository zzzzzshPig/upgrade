import { createStore, Store } from 'vuex'
import { InjectionKey } from 'vue'

type State = {
  count: number;
}

// 对外的类型应该是readonly
export const key: InjectionKey<Store<Readonly<State>>> = Symbol(1)

export default createStore<State>({
  state: {
    count: 1
  },
  mutations: {
    addCount (ctx) {
      ctx.count++
    }
  },
  actions: {
    addCount (ctx) {
      ctx.commit('addCount')
    }
  }
})
