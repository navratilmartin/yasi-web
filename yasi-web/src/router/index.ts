// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthState } from '@/composables/useAuthState'; // Adjust the path as necessary
import { useAuthStore } from '@/store/AuthStore'; // Adjust the path as necessary
import { createPinia, setActivePinia } from 'pinia';

import Default from '@/layouts/default/Default.vue'
import { watchEffect } from 'vue';
// const { currentUser } = useAuthState();
// const { user } = useAuthStore();
watchEffect(() => {
  // console.log('routerCurUser', authStore.user)
})


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
      },
      {
        path: '/login',
        name: 'Login',
        // Zabezpeceni here
        component: () => import( '@/views/Login.vue'),
      },
      {
        path: '/signup',
        name: 'Signup',
        component: () => import('@/views/Home.vue')
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
  },
  {
    path: "/:pathMatch(.*)*", 
    redirect: '/',
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  setActivePinia(createPinia());

  // Now, use your store
  const authStore = useAuthStore();
  const { currentUser } = useAuthState();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  console.log('cookies', isAuthenticated)
  
  // Define public pages that don't require authentication
  const publicPages = ['/login', '/signup']; // Adjust according to your routes
  const authRequired = !publicPages.includes(to.path);

  if (isAuthenticated) {
    if ((to.path === '/login' || to.path === '/signup') && from.name !== null) {
      // Redirect authenticated users away from login and signup pages
      next({ name: 'Home' }); // Redirect to a safe authenticated user page
      return;
    }
  } else if (authRequired) {
    // Redirect unauthenticated users to the login page
    next('/login');
    return;
  }
  
  next();
});

export default router
