import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'
import { message } from 'ant-design-vue'

// 后端返回的通用数据结构
interface BackendResponseData<T = unknown> {
  code: number | string
  data: T
  message?: string
}

// 1. 创建实例
const myAxios: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8081', // 你的后端地址 (带上 /api 前缀)
  timeout: 10000,
  withCredentials: true,
})

// 2. 请求拦截器
myAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// 3. 响应拦截器
myAxios.interceptors.response.use(
  (response: AxiosResponse<BackendResponseData>) => {
    const { data } = response
    const code = Number(data.code)

    if (code === 0) {
      // 剥离外壳，直接返回核心数据
      // 使用 unknown 绕过类型检查，但运行时返回的是 data.data
      return data.data as unknown as AxiosResponse
    } else if (code === 40100) {
      // 未登录
      return Promise.reject(data)
    } else {
      message.error(data.message || '系统错误')
      return Promise.reject(data)
    }
  },
  (error: AxiosError) => {
    message.error('网络异常')
    return Promise.reject(error)
  },
)

/**
 * 🕵️‍♂️ 适配器函数 (OpenAPI 生成代码专用)
 * 必须导出名为 request 的函数
 * 泛型 T 是后端返回的数据类型
 */
export const request = async <T = unknown>(
  url: string,
  options: AxiosRequestConfig = {},
): Promise<T> => {
  return myAxios.request({
    url,
    ...options,
  }) as Promise<T>
}

export default myAxios
