<script setup lang="ts">
import { ref, h } from 'vue'
import {
  PieChartOutlined,
  UserOutlined,
  PictureOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 🕵️‍♂️ 菜单配置：在这里添加你的新页面
const items = ref([
  {
    key: '/',
    icon: () => h(PieChartOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/admin/userManage', // 假设你有用户管理
    icon: () => h(UserOutlined),
    label: '用户管理',
    title: '用户管理',
  },
  // 👇 这就是我们刚才做好的“空间管理”
  {
    key: '/admin/spaceManage',
    icon: () => h(PictureOutlined),
    label: '空间管理',
    title: '空间管理',
  },
])

// 选中的菜单项 (自动同步当前路由)
const selectedKeys = ref<string[]>([route.path])

// 菜单跳转逻辑
const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}

// 退出登录
const handleLogout = () => {
  // 这里写你的退出逻辑，比如清空 token
  router.push('/user/login')
}
</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider theme="dark" collapsible>
      <div class="logo">云图库</div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        :items="items"
        @click="handleMenuClick"
      />
    </a-layout-sider>

    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 20px; display: flex; justify-content: flex-end; align-items: center;">
        <a-button type="text" @click="handleLogout">
          <template #icon><LogoutOutlined /></template>
          退出登录
        </a-button>
      </a-layout-header>

      <a-layout-content style="margin: 16px">
        <div style="padding: 24px; background: #fff; min-height: 360px">
          <router-view />
        </div>
      </a-layout-content>

      <a-layout-footer style="text-align: center">
        Tutu Picture ©2025 Created by Yupi
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  text-align: center;
  line-height: 32px;
  font-weight: bold;
  overflow: hidden;
}
</style>
