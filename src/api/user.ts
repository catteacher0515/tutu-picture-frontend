import request from '@/utils/request'

// 通用响应结构 (对应后端的 BaseResponse)
interface BaseResponse<T> {
  code: number
  data: T
  message: string
}

// 注册请求参数
export interface UserRegisterRequest {
  userAccount: string
  userPassword: string
  checkPassword: string
}

// 登录请求参数
export interface UserLoginRequest {
  userAccount: string
  userPassword: string
}

// 用户信息 VO
export interface LoginUserVO {
  id: number
  userName: string
  userAvatar?: string
  userProfile?: string;
  userRole: string;
  createTime: string;
}

/**
 * 用户注册接口
 * @param params 注册参数
 */
export const userRegisterUsingPost = (params: UserRegisterRequest) => {
  // 后端返回的是 BaseResponse<Long>，经过 request.ts 拦截器处理后，
  // 这里的 Promise resolve 出来的值就是 data.data (即 number 类型的 id)
  return request.post<BaseResponse<number>, number>('/user/register', params)
}
