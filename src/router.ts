import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './pages/LoginPage.vue'
import UsersPage from './pages/UsersPage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage, meta: { guest: true } },
  {
    path: '/users',
    component: UsersPage,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  if (to.meta.guest && isAuthenticated) {
    return next('/users')
  }

  next()
})

export default router
