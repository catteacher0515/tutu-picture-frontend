// src/stores/user.ts

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

// ✅ 修正点 1：导入你 userController.ts 里真实存在的函数名
// (不再是 ...UsingGet 这种长名字了)
import { getLoginUser, userLogout } from '@/generated/backend/userController'

// 类型定义依然引用你之前定义好的
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
      // ✅ 修正点 2：调用 getLoginUser
      const res = await getLoginUser()

      // 这里的 res 经过 request 拦截器处理，已经是 data 部分了
      // 强制类型转换为 LoginUserVO
      const user = res as unknown as LoginUserVO

      if (user && user.id) {
        loginUser.value = user
      } else {
        loginUser.value = { userName: '未登录' } as LoginUserVO
      }
    } catch (error) {
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
      // ✅ 修正点 3：调用 userLogout
      await userLogout()
      message.success('已退出登录')
      // 清空用户信息，恢复为默认状态
      loginUser.value = { userName: '未登录' } as LoginUserVO
    } catch (error) {
      console.error('注销失败', error)
    }
  }

  return { loginUser, fetchLoginUser, setLoginUser, logout }
})
