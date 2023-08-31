// Composables
import { createRouter, createWebHistory } from 'vue-router'

import Default from '@/layouts/default/Default.vue'

const routes = [
  {
    path: '/',
    component: Default,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import( '@/views/Home.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
