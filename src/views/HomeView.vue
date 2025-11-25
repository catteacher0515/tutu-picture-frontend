<script setup lang="ts">
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
</script>

<template>
  <main>
    <h1>欢迎来到云图库</h1>
    <p>当前用户: {{ userStore.loginUser.userName }}</p>
  </main>
</template>
