import { defineComponent, ref } from 'vue'
import { useCountdown } from '@/helpers'

export default defineComponent({
  setup () {
    const { start, end, ing, time } = useCountdown(6)

    return {
      countdown: ref({
        start,
        end,
        ing,
        time
      })
    }
  }
})
