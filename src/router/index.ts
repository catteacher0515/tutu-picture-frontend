import { createRouter, createWebHistory } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
// 如果这几个文件还没创建，可能会报红，先不用管，或者先创建空文件
import HomeView from '@/views/HomeView.vue'
import PictureAddPage from '@/pages/PictureAddPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. 登录注册页 (它们不需要顶部菜单，所以单独放)
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage
    },

    // 2. 主业务区域 (需要顶部菜单，全部放在 BasicLayout 下)
    {
      path: '/',
      component: BasicLayout,
      children: [
        {
          path: '', // 默认子路由，匹配 /
          name: '主页',
          component: HomeView
        },
        {
          path: '/add_picture',
          name: '创建图片',
          component: PictureAddPage // ⚠️ 这里会报红，直到你创建这个文件
        },
        // 后续可以在这里加 Space 相关的页面
      ]
    },

    // 3. 这里的 About 可以删了，或者保留做测试
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
