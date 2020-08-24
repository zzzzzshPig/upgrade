import { defineComponent, provide, ref } from 'vue'
import Inject from '../inject/index.vue'
import { injectRef, injectBase } from '../config'

export default defineComponent({
    setup () {
        const provideRef = ref('injectRef')
        const provideBase = 'injectBase'

        provide(injectRef, provideRef)
        provide(injectBase, provideBase)

        return {
            changeProvide () {
                provideRef.value += '1'
            },
        	provideRef,
            provideBase
        }
    },

    components: {
        Inject
    }
})
