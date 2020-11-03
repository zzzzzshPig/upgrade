import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

export default defineComponent({
  setup () {
    const store = useStore(key)
    console.log(store.state.count)
    store.commit('addCount')
    store.dispatch('addCount')
    console.log(store.state.count)
    console.log(store.state.count)

    return {}
  }
})
