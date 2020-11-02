import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/event-bus',
    name: 'event-bus',
    component: () => import('@/views/event-bus/index.vue')
  },
  {
    path: '/vue-router-next',
    name: 'vue-router-next',
    component: () => import('@/views/vue-router-next/index.vue'),
    children: [
      {
        path: 'child',
        name: 'child',
        component: () => import('@/views/vue-router-next/child/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
