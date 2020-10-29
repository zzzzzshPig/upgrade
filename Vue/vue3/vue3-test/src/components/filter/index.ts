import {defineComponent, onBeforeUnmount, reactive} from 'vue'
import {abort, track, trackKey} from '@/helpers/bus'

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
            abort(trackKey.filterItemChange, '0')
        })

        return {
            filters
        }
    }
})
