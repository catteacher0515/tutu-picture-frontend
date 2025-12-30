<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">

      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>

      <a-layout-footer class="footer">
        <a href="https://github.com/YourName" target="_blank">
          云图库 by 花萍雨
        </a>
      </a-layout-footer>

    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<style scoped>
#basicLayout {
  /* 我们的 main.css 已经处理了大部分全局样式 */
}

.header {
  padding-inline: 20px;
  background: #fff0d6 !important; /* 再次确保米黄色 */
  margin-bottom: 24px;
}

.content {
  padding: 0 20px;
  /* 这里不加背景色，让它透出 Body 的纸质背景。
     给一个最大宽度，防止大屏上太散
  */
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.footer {
  text-align: center;
  background: transparent;
  padding: 16px;
  font-weight: bold;
}
</style>
