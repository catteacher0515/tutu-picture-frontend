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

// 用户信息 VO (ID 改为 string)
export interface LoginUserVO {
  id: string
  userName: string
  userAvatar?: string
  userProfile?: string;
  userRole: string;
  createTime: string;
  updateTime: string;
}

/**
 * 用户注册接口
 */
export const userRegisterUsingPost = (params: UserRegisterRequest) => {
  return request.post<BaseResponse<number>, number>('/user/register', params)
}

/**
 * 用户登录接口
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

// --- 管理员接口相关 ---

// 通用删除请求 (ID 改为 string)
export interface DeleteRequest {
  id: string
}

// 创建用户请求
export interface UserAddRequest {
  userAccount: string
  userAvatar?: string
  userName?: string
  userPassword?: string
  userProfile?: string
  userRole?: string
}

// 更新用户请求 (ID 改为 string)
export interface UserUpdateRequest {
  id: string
  userAccount?: string
  userAvatar?: string
  userName?: string
  userProfile?: string
  userRole?: string
}

/**
 * 创建用户 (管理员)
 * 注意：后端返回的 ID 已经被 Jackson 转为 string
 */
export const addUserUsingPost = (params: UserAddRequest) => {
  return request.post<BaseResponse<string>, string>('/user/add', params)
}

/**
 * 删除用户 (管理员)
 */
export const deleteUserUsingPost = (params: DeleteRequest) => {
  return request.post<BaseResponse<boolean>, boolean>('/user/delete', params)
}

/**
 * 更新用户 (管理员)
 */
export const updateUserUsingPost = (params: UserUpdateRequest) => {
  return request.post<BaseResponse<boolean>, boolean>('/user/update', params)
}

/**
 * 根据 id 获取用户 (管理员) (ID 参数改为 string)
 */
export const getUserByIdUsingGet = (id: string) => {
  return request.get<BaseResponse<LoginUserVO>, LoginUserVO>('/user/get', {
    params: { id },
  })
}
