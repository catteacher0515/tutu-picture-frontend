<template>
  <div id="app-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 这里不需要写什么逻辑
</script>

<style>
/* 3. 确保没有任何 scoped 样式阻挡我们的全屏布局 */
#app-container {
  height: 100vh;
  width: 100vw;
}
</style>
