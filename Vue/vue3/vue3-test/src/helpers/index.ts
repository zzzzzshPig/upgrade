import { ref, onBeforeUnmount } from 'vue'

export function useCountdown (count = 60, interval = 1000) {
  const time = ref(count)
  const ing = ref(false)
  let timer = 0

  function end () {
    clearInterval(timer)
    time.value = count
    timer = 0
    ing.value = false
  }

  onBeforeUnmount(() => {
    end()
  })

  function start () {
    end()
    ing.value = true

    timer = setInterval(() => {
      if (time.value <= 0) {
        end()
        return
      }

      time.value -= interval / 1000
    }, interval)
  }

  return {
    ing,
    time,
    start,
    end
  }
}
