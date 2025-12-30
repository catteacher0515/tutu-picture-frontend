
<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <RouterLink to="/">
          <div class="title-bar">
            <img class="logo" src="@/assets/logo.svg" alt="logo" />
            <div class="title">云图库</div>
          </div>
        </RouterLink>
      </a-col>

      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
          class="hand-drawn-menu"
        />
      </a-col>

      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="loginUser.id">
            <a-dropdown>
              <a-space class="user-box">
                <a-avatar :src="loginUser.userAvatar" />
                <span class="username">{{ loginUser.userName ?? '无名侦探' }}</span>
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="my_space">
                    <router-link to="/my_space">我的空间</router-link>
                  </a-menu-item>
                  <a-menu-item key="logout" @click="doLogout">
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref, watchEffect } from 'vue'
import { HomeOutlined, CloudUploadOutlined, UserOutlined, AppstoreOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { userLogoutUsingPost } from '@/api/user'
import { message } from 'ant-design-vue'

const router = useRouter()
const userStore = useUserStore()
// 获取当前登录用户
const loginUser = computed(() => userStore.loginUser)

// 菜单选中高亮
const current = ref<string[]>([])

// 监听路由变化，更新高亮
router.afterEach((to) => {
  current.value = [to.path]
})

// 菜单定义
const items = computed(() => {
  const menus = [
    {
      key: '/',
      icon: () => h(HomeOutlined),
      label: '公共大厅', // 首页
      title: '公共大厅',
    },
    {
      key: '/add_picture',
      icon: () => h(CloudUploadOutlined),
      label: '上传创作',
      title: '上传创作',
    },
    // 下面这两个之后会做，先占位
    // {
    //   key: '/my_space',
    //   icon: () => h(UserOutlined),
    //   label: '我的空间',
    //   title: '我的空间',
    // },
  ]

  // 如果是管理员，显示管理菜单
  if (loginUser.value.userRole === 'admin') {
    menus.push({
      key: '/admin/userManage',
      icon: () => h(AppstoreOutlined),
      label: '用户管理',
      title: '用户管理',
    })
  }
  return menus
})

// 菜单点击事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}

// 退出登录
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res) {
    message.success('已退出')

    // ✅ 修复方案：赋予一个完整的“游客身份”
    userStore.setLoginUser({
      id: '',           // 必须有
      userName: '未登录',
      userRole: 'guest', // 必须有
      userAvatar: '',
      userProfile: '',
      createTime: '',    // 必须有
      updateTime: ''     // 必须有
    })

    router.push('/user/login')
  }
}
</script>

<style scoped>
/* 顶部栏容器：我们在 main.css 里已经定义了 ant-layout-header 的样式
   这里只需要微调内部布局
*/
.title-bar {
  display: flex;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
}

.logo {
  height: 40px;
  margin-right: 10px;
  /* Logo 也来点手绘风：稍微歪一点 */
  transform: rotate(-3deg);
  filter: drop-shadow(2px 2px 0px rgba(0,0,0,1));
}

.title {
  font-size: 20px;
  color: #000;
  font-weight: 800;
  font-family: 'Comic Sans MS', cursive; /* 强制手绘字体 */
}

/* 强制覆盖 Ant Menu 的默认样式，适配手绘风 */
.hand-drawn-menu {
  background: transparent;
  border-bottom: none !important;
  line-height: 64px;
}

/* 菜单项文字 */
:deep(.ant-menu-item) {
  font-weight: bold;
  color: #555 !important;
  font-size: 16px;
  border-bottom: none !important;
}

/* 选中状态：加一个黑色下划线，或者变黑 */
:deep(.ant-menu-item-selected) {
  color: #000 !important;
  /* 模拟手绘下划线 */
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10' preserveAspectRatio='none'%3E%3Cpath d='M0 5 Q 50 10 100 5' stroke='black' stroke-width='3' fill='none'/%3E%3C/svg%3E") no-repeat bottom center !important;
  background-size: 100% 10px !important;
}

/* 悬停状态 */
:deep(.ant-menu-item:hover) {
  color: #000 !important;
}

.user-box {
  cursor: pointer;
  padding: 5px 10px;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.user-box:hover {
  /* 鼠标放头像上时，加个框 */
  border: 2px solid #000;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 2px 2px 0px rgba(0,0,0,1);
}

.username {
  font-weight: bold;
  color: #000;
}
</style>
