import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import PictureDetail from '@/pages/PictureDetail.vue' // 👈 引入没问题

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
    {
      path: '/admin/userManage',
      name: 'adminUserManage',
      component: UserManagePage,
    },
    {
      path: '/admin/spaceManage',
      name: 'SpaceManage',
      component: () => import('@/pages/admin/SpaceManagePage.vue'),
      meta: {
        title: '空间管理',
        requiresAuth: true
      }
    },
    // 👇👇👇 核心修复区 👇👇👇
    {
      // 🕵️‍♂️ 侦探修正：把 '/picture_detail/:id' 改为 '/picture/:id'
      // 这样才能匹配你访问的 URL: http://localhost:5173/picture/2001...
      path: '/picture/:id',
      name: 'PictureDetail',
      component: PictureDetail,
      props: true, // 建议加上，允许将 id 作为 props 传给组件
      meta: {
        title: '图片详情',
      }
    },
  ],
})

export default router
