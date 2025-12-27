<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div v-if="route.path.startsWith('/user')">
    <router-view />
  </div>
  <div v-else>
    <BasicLayout />
  </div>
</template>

<style scoped>
</style>
