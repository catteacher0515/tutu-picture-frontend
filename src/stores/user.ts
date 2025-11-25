import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserUsingGet } from '@/api/user'
import type { LoginUserVO } from '@/api/user'

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
      if (res) {
        loginUser.value = res
      }
    } catch (error) {
      // 获取失败（如401），置为默认状态，不抛错，以免阻塞页面渲染
      loginUser.value = { userName: '未登录' } as LoginUserVO
    }
  }

  // 设置用户信息（登录成功后手动设置，省去一次请求）
  function setLoginUser(user: LoginUserVO) {
    loginUser.value = user
  }

  return { loginUser, fetchLoginUser, setLoginUser }
})
