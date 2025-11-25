<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view />
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
// 引入 Ant Design Vue 的中文包 (可选，为了以后组件显示中文)
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
const locale = zhCN;
</script>

<style scoped>
/* 这里留空，或者写一些全局样式 */
</style>
