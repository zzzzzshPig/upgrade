import {defineComponent, onBeforeUnmount, reactive} from 'vue'
import {deleteEffectsId, track, trackKey} from '@/helpers/bus'

export default defineComponent({
    setup () {
        const filters = reactive<Array<{
            id: string
            text: string
            value: any
        }>>([])

        track(trackKey.filterItemChange, '0', (a) => {
            filters.push(a)
            console.log(filters)
        })

        onBeforeUnmount(() => {
            deleteEffectsId(trackKey.filterItemChange, '0')
        })

        return {
            filters
        }
    }
})
