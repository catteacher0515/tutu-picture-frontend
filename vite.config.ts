import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 1. 暂时注释掉这个“显眼包”插件的引入
// import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    // 2. 暂时注释掉插件的调用，这样那个黑框就会消失
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 👇👇👇 重点是这一块 (已完整保留) 👇👇👇
      '/api': {
        target: 'http://localhost:8081', // 后端地址
        changeOrigin: true,
        ws: true, // 👈 关键：WebSocket 代理设置完好无损！
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 👆👆👆 重点结束 👆👆👆
    },
  },
})
