import request from '@/utils/request'

// 1. 通用响应结构 (必须导出)
export interface BaseResponse<T> {
  code: number
  data: T
  message: string
}

// --- DTO 定义 ---

export interface UserRegisterRequest {
  userAccount: string
  userPassword: string
  checkPassword: string
}

export interface UserLoginRequest {
  userAccount: string
  userPassword: string
}

// 2. 用户信息 VO (必须导出，且 ID 为 string)
export interface LoginUserVO {
  id: string
  userName: string
  userAvatar?: string
  userProfile?: string
  userRole: string
  createTime: string
  updateTime: string
}

// 用户分页查询请求
export interface UserQueryRequest {
  current?: number
  pageSize?: number
  sortField?: string
  sortOrder?: string
  id?: string
  userName?: string
  userProfile?: string
  userRole?: string
}

export interface DeleteRequest {
  id: string
}

export interface UserAddRequest {
  userAccount: string
  userAvatar?: string
  userName?: string
  userPassword?: string
  userProfile?: string
  userRole?: string
}

export interface UserUpdateRequest {
  id: string
  userAccount?: string
  userAvatar?: string
  userName?: string
  userProfile?: string
  userRole?: string
}

export interface UserUpdateMyRequest {
  userAvatar?: string
  userName?: string
  userProfile?: string
}

// --- 接口定义 ---

/**
 * 用户注册
 */
export const userRegisterUsingPost = (params: UserRegisterRequest) => {
  return request.post<BaseResponse<number>, BaseResponse<number>>('/user/register', params)
}

/**
 * 用户登录
 */
export const userLoginUsingPost = (params: UserLoginRequest) => {
  return request.post<BaseResponse<LoginUserVO>, BaseResponse<LoginUserVO>>('/user/login', params)
}

/**
 * 获取当前登录用户
 * ✅ 修正点：第二个泛型改为 BaseResponse<LoginUserVO>，让 TS 知道返回值里有 code
 */
export const getLoginUserUsingGet = () => {
  return request.get<BaseResponse<LoginUserVO>, BaseResponse<LoginUserVO>>('/user/current')
}

/**
 * 用户退出登录
 */
export const userLogoutUsingPost = () => {
  return request.post<BaseResponse<boolean>, BaseResponse<boolean>>('/user/logout')
}

/**
 * 更新个人信息
 */
export const updateMyUserUsingPost = (params: UserUpdateMyRequest) => {
  return request.post<BaseResponse<boolean>, BaseResponse<boolean>>('/user/update/my', params)
}

// --- 管理员接口 ---

/**
 * 创建用户
 */
export const addUserUsingPost = (params: UserAddRequest) => {
  return request.post<BaseResponse<string>, BaseResponse<string>>('/user/add', params)
}

/**
 * 删除用户
 */
export const deleteUserUsingPost = (params: DeleteRequest) => {
  return request.post<BaseResponse<boolean>, BaseResponse<boolean>>('/user/delete', params)
}

/**
 * 更新用户
 */
export const updateUserUsingPost = (params: UserUpdateRequest) => {
  return request.post<BaseResponse<boolean>, BaseResponse<boolean>>('/user/update', params)
}

/**
 * 根据 id 获取用户
 */
export const getUserByIdUsingGet = (id: string) => {
  return request.get<BaseResponse<LoginUserVO>, BaseResponse<LoginUserVO>>('/user/get', {
    params: { id },
  })
}

/**
 * 分页获取用户列表
 */
export const listUserByPageUsingPost = (params: UserQueryRequest) => {
  return request.post<BaseResponse<Page<LoginUserVO>>, BaseResponse<Page<LoginUserVO>>>('/user/list/page', params)
}

// 分页通用类型
export interface Page<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}
