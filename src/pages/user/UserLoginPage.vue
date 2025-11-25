<template>
  <div id="userLoginPage">
    <div class="login-container">
      <h2 class="title">云图库 - THE AIRLOCK</h2>
      <div class="sub-title">LOGIN</div>

      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <div class="input-group">
          <div class="label">USERNAME / EMAIL</div>
          <a-form-item
            name="userAccount"
            :rules="[{ required: true, message: '请输入账号!' }, { min: 4, message: '账号长度不能少于 4 位' }]"
          >
            <a-input v-model:value="formState.userAccount" class="glass-input" placeholder="请输入账号" />
          </a-form-item>
        </div>

        <div class="input-group">
          <div class="label">PASSWORD</div>
          <a-form-item
            name="userPassword"
            :rules="[{ required: true, message: '请输入密码!' }, { min: 8, message: '密码不能少于 8 位' }]"
          >
            <a-input-password v-model:value="formState.userPassword" class="glass-input" placeholder="请输入密码" />
          </a-form-item>
        </div>

        <a-form-item>
          <a-button type="primary" html-type="submit" class="glass-btn">
            ENGAGE (登录)
          </a-button>
        </a-form-item>

        <div class="footer-link">
          Don't have an account? <RouterLink to="/user/register">Go to Register.</RouterLink>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import type { UserLoginRequest } from '@/api/user';

const router = useRouter();

const formState = reactive<UserLoginRequest>({
  userAccount: '',
  userPassword: '',
});

const onFinish = async (values: UserLoginRequest) => {
  console.log('Success:', values);
  // TODO: 对接后端登录接口
  message.success('登录成功');

  // ✅ 修复：使用 await 调用路由跳转，解决 unused router 和 missing await 问题
  await router.push('/');
};

// ✅ 修复：使用 unknown 替代 any
const onFinishFailed = (errorInfo: unknown) => {
  console.log('Failed:', errorInfo);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

#userLoginPage {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom right, #0f0c29, #302b63, #24243e);
  position: relative;
  overflow: hidden;
}

#userLoginPage::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
  animation: moveStars 100s linear infinite;
}

@keyframes moveStars {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.login-container {
  position: relative;
  z-index: 10;
  width: 440px;
  padding: 48px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  text-align: center;
}

.title {
  font-family: 'Orbitron', sans-serif;
  color: #fff;
  margin-bottom: 4px;
  font-weight: 700;
  font-size: 24px;
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  white-space: nowrap;
}

.sub-title {
  color: #aaa;
  margin-bottom: 32px;
  letter-spacing: 4px;
  font-size: 12px;
  text-transform: uppercase;
}

.input-group {
  margin-bottom: 24px;
  text-align: left;
}

.label {
  font-size: 12px;
  color: #ccc;
  margin-bottom: 8px;
  font-weight: 600;
  margin-left: 4px;
}

:deep(.ant-input),
:deep(.ant-input-password),
:deep(.ant-input-affix-wrapper) {
  background-color: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
  height: 44px;
  border-radius: 8px !important;
  box-shadow: none !important;
}

:deep(.ant-input-affix-wrapper > input.ant-input) {
  background: transparent !important;
  border: none !important;
  height: 100%;
  color: #fff !important;
}

:deep(.ant-input-affix-wrapper:focus),
:deep(.ant-input-affix-wrapper-focused) {
  border-color: #00c6ff !important;
  box-shadow: 0 0 10px rgba(0, 198, 255, 0.3) !important;
}

:deep(input::placeholder),
:deep(.ant-input::placeholder) {
  color: rgba(255, 255, 255, 0.3) !important;
}

:deep(.ant-input-password-icon) {
  color: rgba(255, 255, 255, 0.5) !important;
}
:deep(.ant-input-password-icon:hover) {
  color: #fff !important;
}

:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus),
:deep(input:-webkit-autofill:active) {
  -webkit-text-fill-color: #fff !important;
  transition: background-color 5000s ease-in-out 0s;
  background-color: transparent !important;
}

.glass-btn {
  width: 100%;
  height: 48px;
  margin-top: 16px;
  background: linear-gradient(90deg, #00c6ff, #0072ff);
  border: none;
  border-radius: 8px;
  font-family: 'Orbitron', sans-serif;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 114, 255, 0.4);
  transition: all 0.3s;
}

.glass-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 114, 255, 0.6);
  filter: brightness(1.1);
}

.footer-link {
  margin-top: 24px;
  font-size: 13px;
  color: #888;
}

.footer-link a {
  color: #00c6ff;
  margin-left: 5px;
  text-decoration: none;
  font-weight: bold;
}

.footer-link a:hover {
  color: #fff;
  text-shadow: 0 0 5px #00c6ff;
}
</style>
