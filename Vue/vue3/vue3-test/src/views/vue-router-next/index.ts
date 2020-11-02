import { defineComponent } from 'vue'
import { createRouter, createWebHistory, NavigationFailureType, START_LOCATION, onBeforeRouteLeave, onBeforeRouteUpdate, useLink, useRoute, useRouter } from 'vue-router'

export default defineComponent({
  setup () {
    const Router = createRouter({
      history: createWebHistory(''),
      routes: []
    })
    console.log('Router ---- ', Router)

    console.log('NavigationFailureType ---- ', NavigationFailureType)

    console.log('START_LOCATION ---- ', START_LOCATION)

    onBeforeRouteLeave((leaveGuard) => {
      console.log('onBeforeRouteLeave', leaveGuard)
    })

    onBeforeRouteUpdate((updateGuard) => {
      console.log('onBeforeRouteUpdate', updateGuard)
    })

    console.log('useLink', useLink({
      to: '/event-bus'
    }))

    console.log('useRoute', useRoute())

    console.log('useRouter', useRouter())

    return {}
  }
})
