import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue' // 👈 引入登录页
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue' // 👈 引入注册页

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/user/login',
      name: 'user_login',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: 'user_register',
      component: UserRegisterPage,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
