import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'

// 1. 引入 Ant Design Vue 的官方重置样式 (V4 版本)
// 如果报错找不到这个文件，说明版本差异，可尝试删除这行，不影响核心手绘风
import 'ant-design-vue/dist/reset.css'

// 2. 🕵️‍♂️ 关键点：引入我们刚才写好的“手绘风”全局样式
// 必须放在 Antd 样式之后，才能覆盖它！
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')
