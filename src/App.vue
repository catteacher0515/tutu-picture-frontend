<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view />
    </a-config-provider>
  </div>
</template>
<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'

dayjs.locale('zh-cn')
const locale = zhCN

const userStore = useUserStore()

// 页面加载时，尝试获取登录用户
onMounted(() => {
  userStore.fetchLoginUser()
})
</script>
<style scoped>
</style>
