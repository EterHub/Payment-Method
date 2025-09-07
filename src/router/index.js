import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TransactionView from '../views/TransactionView.vue'
import LoginView from '../views/LoginView.vue'

const isAuthenticated = () => {
  const loginStatus = localStorage.getItem('login')

  if (!loginStatus || loginStatus !== 'true') {
    return false
  }

  return true
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: TransactionView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated()

  if (to.meta.requiresAuth && !authenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
