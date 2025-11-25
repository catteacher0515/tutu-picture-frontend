<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// 退出登录逻辑
const doLogout = async () => {
  // 调用 Store 的 logout 方法
  await userStore.logout()
  // 跳转到登录页
  router.push('/user/login')
}
</script>

<template>
  <main>
    <h1>欢迎来到云图库</h1>
    <div v-if="userStore.loginUser.id">
      <p>当前用户: {{ userStore.loginUser.userName }}</p>
      <p>角色: {{ userStore.loginUser.userRole }}</p>
      <a-button type="primary" danger @click="doLogout">退出登录</a-button>
    </div>

    <div v-else>
      <p>当前用户: 未登录</p>
      <router-link to="/user/login">
        <a-button type="primary">去登录</a-button>
      </router-link>
    </div>
  </main>
</template>
