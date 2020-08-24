import { defineComponent, ref } from 'vue'
import Index from './index/index.vue'

export default defineComponent({
    components: {
        Index
    },
    setup () {
        return {
            show: ref(true)
        }
    }
})
