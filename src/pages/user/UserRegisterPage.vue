<template>
  <div class="login-container">
    <div class="hand-drawn-card">
      <h2 class="title">✏️ 新用户注册</h2>
      <div class="sub-title">开始你的创作之旅</div>

      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          name="userAccount"
          :rules="[{ required: true, message: '请输入账号!' }, { min: 4, message: '账号长度不能少于 4 位' }]"
        >
          <a-input v-model:value="formState.userAccount" placeholder="设置账号" size="large" />
        </a-form-item>

        <a-form-item
          name="userPassword"
          :rules="[{ required: true, message: '请输入密码!' }, { min: 8, message: '密码不能少于 8 位' }]"
        >
          <a-input-password v-model:value="formState.userPassword" placeholder="设置密码" size="large" />
        </a-form-item>

        <a-form-item
          name="checkPassword"
          :rules="[{ required: true, message: '请再次输入密码!' }, { min: 8, message: '密码不能少于 8 位' }]"
        >
          <a-input-password v-model:value="formState.checkPassword" placeholder="确认密码" size="large" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%" size="large">
            注 册
          </a-button>
        </a-form-item>

        <div class="footer-link">
          已经有账号了？ <RouterLink to="/user/login">返回登录</RouterLink>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { userRegisterUsingPost } from '@/api/user'
import type { UserRegisterRequest } from '@/api/user'

const router = useRouter()

const formState = reactive<UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

/**
 * 提交注册表单
 */
const onFinish = async (values: UserRegisterRequest) => {
  if (values.userPassword !== values.checkPassword) {
    message.error('两次输入的密码不一致!')
    return
  }

  try {
    const res = await userRegisterUsingPost(values)
    if (res) {
      message.success('注册成功! 请登录')
      await router.push('/user/login')
    }
  } catch (error) {
    console.error('注册失败', error)
  }
}

const onFinishFailed = (errorInfo: unknown) => {
  console.log('Failed:', errorInfo)
}
</script>

<style scoped>
.footer-link {
  margin-top: 16px;
  font-size: 14px;
}
.footer-link a {
  color: #ff9900;
  font-weight: bold;
  text-decoration: underline;
}
</style>
