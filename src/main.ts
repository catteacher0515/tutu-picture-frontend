import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'; // 👈 引入 Antd
import 'ant-design-vue/dist/reset.css'; // 👈 引入全局样式

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd) // 👈 全局注册

app.mount('#app')
