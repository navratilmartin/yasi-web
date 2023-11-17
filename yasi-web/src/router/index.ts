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
      {
        path: '/about',
        name: 'About',
        component: () => import( '@/views/About.vue'),
      }
    ],
  },
  {
    path: '/groups',
    component: Default,
    children: [
      {path: '',
      name: 'Groups',
      component: () => import('@/views/Groups.vue')
    },
    ],
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
