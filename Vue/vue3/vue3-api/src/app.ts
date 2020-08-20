import { defineComponent } from 'vue'
import Setup from '@/components/setup/index.vue'

export default defineComponent({
    name: 'App',

    components: {
        Setup
    },

    setup () {
        return {
            entry: 'Setup'
        }
    }
})
