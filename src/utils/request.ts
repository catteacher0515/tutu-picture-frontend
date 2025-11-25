import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig, AxiosError } from 'axios'
import { message } from 'ant-design-vue'

// 1. 定义后端返回的通用数据结构 (与后端 BaseResponse 对应)
// 这样我们就能在 error.response.data 中安全地访问 message 字段
interface BackendResponseData<T = any> {
  code: number
  data: T
  message?: string
}

// 创建 Axios 实例
const myAxios: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true,
})

// 全局请求拦截器
myAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    return config
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 全局响应拦截器
myAxios.interceptors.response.use(
  (response: AxiosResponse<BackendResponseData>) => {
    // 2xx 范围内的状态码都会触发该函数
    const { data } = response
    // 如果后端返回的 code 不是 0 (SUCCESS)，则视为业务错误
    if (data.code === 0) {
      return data.data
    } else {
      // 统一处理业务错误
      message.error(data.message || '系统错误')
      return Promise.reject(data)
    }
  },
  /**
   * 核心修正点：
   * 使用 AxiosError<BackendResponseData> 泛型。
   * 告诉 TS：error.response.data 的类型是 BackendResponseData。
   * 这样就不需要 (as any) 就能直接访问 .message 了。
   */
  (error: AxiosError<BackendResponseData>) => {
    // 超出 2xx 范围的状态码都会触发该函数
    const errorMsg = error.response?.data?.message || '网络异常'
    message.error(errorMsg)
    return Promise.reject(error)
  },
)

export default myAxios
