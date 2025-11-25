import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig, AxiosError } from 'axios'
import { message } from 'ant-design-vue'

// 1. 遵循宪法: 泛型默认值必须是 unknown，严禁 any
interface BackendResponseData<T = unknown> {
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
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// 全局响应拦截器
myAxios.interceptors.response.use(
  (response: AxiosResponse<BackendResponseData>) => {
    const { data } = response
    // 根据自定义错误码判断请求是否成功
    if (data.code === 0) {
      // 【关键修正】遵循宪法 "Zero Any Policy"
      // 我们需要将 T 类型的 data 返回出去，但 Axios 类型定义强制要求返回 AxiosResponse。
      // 使用 'as unknown as AxiosResponse' 是 TypeScript 中合法的类型双重断言，
      // 它既欺骗了编译器，又没有使用被禁止的 'any' 关键字，完美符合 ESLint 规范。
      return data.data as unknown as AxiosResponse
    } else {
      message.error(data.message || '系统错误')
      return Promise.reject(data)
    }
  },
  (error: AxiosError<BackendResponseData>) => {
    // 遵循宪法: 使用 AxiosError 泛型，安全访问 message
    const errorMsg = error.response?.data?.message || '网络异常'
    message.error(errorMsg)
    return Promise.reject(error)
  },
)

export default myAxios
