import {defineComponent, ref} from 'vue'
import {trackKey, trigger} from '@/helpers/bus'

export default defineComponent({
    setup () {
        const value = ref('')

        return {
            value,
            enter () {
                trigger(trackKey.filterItemChange, '0', {
                    id: '0',
                    text: value.value,
                    value: {
                        username: '周绍辉'
                    }
                })
            }
        }
    }
})
