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
        path: '/groups',
        name: 'Groups',
        component: () => import( '@/views/Groups.vue'),
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import( '@/views/Login.vue'),
      },
      {
        path: '/signup',
        name: 'Signup',
        component: () => import('@/views/Signup.vue')
      },
      {
        path: '/route',
        name: 'Route',
        component: () => import('@/views/Route.vue')
      },
      {
        path: '/photos',
        name: 'Photos',
        component: () => import('@/views/Photos.vue')
      },
      {
        path: '/skaut',
        name: 'Skaut',
        component: () => import('@/views/Skaut.vue')
      },
      {
        path: "/:pathMatch(.*)*", 
        redirect: '/',
      }
    ],
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userEmail = localStorage.getItem('userEmail'); 

  const specificEmail = 'martinacek.n@gmail.com'; 
  const publicPages = ['/login', '/skaut']; 
  const authRequired = !publicPages.includes(to.path);

  if (isAuthenticated) {
    if ((to.path === '/login') && from.name !== null) {
      next({ name: 'Home' });
      return;
    }
    // Check for specific email on the signIn page
    if (to.path === '/signup' && userEmail !== specificEmail) {
      next({ name: 'Home' }); // Redirect to a different page if email doesn't match
      return;
    }
  } else if (authRequired) {
    next('/login');
    return;
  }

  next();
});

export default router
