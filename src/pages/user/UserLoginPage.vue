<template>
  <div class="login-container">
    <div class="hand-drawn-card">
      <h2 class="title">📸 云图库</h2>
      <div class="sub-title">LOGIN</div>

      <a-form
        :model="formState"
        layout="vertical"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="账号"
          name="userAccount"
          :rules="[{ required: true, message: '请输入账号!' }, { min: 4, message: '账号长度不能少于 4 位' }]"
        >
          <a-input v-model:value="formState.userAccount" placeholder="请输入账号" size="large" />
        </a-form-item>

        <a-form-item
          label="密码"
          name="userPassword"
          :rules="[{ required: true, message: '请输入密码!' }, { min: 8, message: '密码不能少于 8 位' }]"
        >
          <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" size="large" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%" size="large">
            登 录 (ENGAGE)
          </a-button>
        </a-form-item>

        <div class="footer-link">
          还没有账号？ <RouterLink to="/user/register">去注册一张门票</RouterLink>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { userLoginUsingPost } from '@/api/user'
import type { UserLoginRequest } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 1. 定义表单数据 (完全保留原逻辑)
const formState = reactive<UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

/**
 * 2. 提交登录表单 (完全保留原逻辑)
 * @param values
 */
const onFinish = async (values: UserLoginRequest) => {
  try {
    // 调用接口
    const res = await userLoginUsingPost(values)

    // 登录成功
    if (res) {
      message.success('登录成功')
      // 保存用户状态
      userStore.setLoginUser(res)
      // 跳转主页
      await router.push('/')
    }
  } catch (error) {
    // 拦截器通常会处理错误，这里做兜底日志
    console.error("登录失败", error)
  }
}

const onFinishFailed = (errorInfo: unknown) => {
  console.log('Failed:', errorInfo)
}
</script>

<style scoped>
/* 样式全删！
  全部交给了 src/assets/main.css 处理。
  这正是代码变短的原因。
*/
.footer-link {
  margin-top: 16px;
  font-size: 14px;
  text-align: center;
}
.footer-link a {
  color: #2c3e50;
  font-weight: bold;
  text-decoration: underline;
}
</style>
