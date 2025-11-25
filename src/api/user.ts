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
  updateTime: string;
}

/**
 * 用户注册接口
 * @param params 注册参数
 */
export const userRegisterUsingPost = (params: UserRegisterRequest) => {
  return request.post<BaseResponse<number>, number>('/user/register', params)
}

/**
 * 用户登录接口
 * @param params 登录参数
 */
export const userLoginUsingPost = (params: UserLoginRequest) => {
  return request.post<BaseResponse<LoginUserVO>, LoginUserVO>('/user/login', params)
}

/**
 * 获取当前登录用户
 */
export const getLoginUserUsingGet = () => {
  return request.get<BaseResponse<LoginUserVO>, LoginUserVO>('/user/current')
}

/**
 * 用户退出登录
 */
export const userLogoutUsingPost = () => {
  return request.post<BaseResponse<boolean>, boolean>('/user/logout')
}
