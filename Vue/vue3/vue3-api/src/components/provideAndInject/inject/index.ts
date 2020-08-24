import { defineComponent, inject } from 'vue'
import { injectRef, injectBase } from '../config'

export default defineComponent({
    setup () {
    	const injRef = inject(injectRef)
        const ingBase = inject(injectBase)

    	return {
            changeInject () {
            	// 慎重使用
                injRef && (injRef.value = '123')
            },
    		injectRef: injRef,
            injectBase: ingBase
        }
    }
})
