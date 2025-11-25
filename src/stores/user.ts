import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserUsingGet, userLogoutUsingPost } from '@/api/user'
import type { LoginUserVO } from '@/api/user'
import { message } from 'ant-design-vue'

export const useUserStore = defineStore('user', () => {
  // 默认未登录状态
  const loginUser = ref<LoginUserVO>({
    userName: '未登录',
  } as LoginUserVO)

  /**
   * 获取当前登录用户信息
   */
  async function fetchLoginUser() {
    try {
      const res = await getLoginUserUsingGet()
      // 因为 request.ts 拦截器已经处理了 data.data，所以 res 就是 LoginUserVO
      if (res && res.id) {
        loginUser.value = res
      }
    } catch (error) {
      // 【修复 ESLint】使用了 error 变量，满足规则
      console.log('获取登录用户失败（可能是未登录）', error)
      loginUser.value = { userName: '未登录' } as LoginUserVO
    }
  }

  /**
   * 设置用户信息（登录成功后手动设置，省去一次请求）
   */
  function setLoginUser(user: LoginUserVO) {
    loginUser.value = user
  }

  /**
   * 退出登录
   */
  async function logout() {
    try {
      await userLogoutUsingPost()
      message.success('已退出登录')
      // 清空用户信息，恢复为默认状态
      loginUser.value = { userName: '未登录' } as LoginUserVO
    } catch (error) {
      console.error('注销失败', error)
    }
  }

  // 【关键位置】return 必须在 defineStore 的回调函数末尾
  return { loginUser, fetchLoginUser, setLoginUser, logout }
})
