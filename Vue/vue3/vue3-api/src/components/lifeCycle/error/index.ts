import { defineComponent } from 'vue'

export default defineComponent({
    setup () {
    	return {
    		error () {
    			throw new Error('error component')
            }
        }
    }
})
