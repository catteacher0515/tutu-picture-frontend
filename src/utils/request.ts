import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig, AxiosError } from 'axios'
import { message } from 'ant-design-vue'

// 1. 遵循宪法: 泛型默认值必须是 unknown，严禁 any
interface BackendResponseData<T = unknown> {
  code: number
  data: T
  message?: string
}

const myAxios: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true,
})

myAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

myAxios.interceptors.response.use(
  (response: AxiosResponse<BackendResponseData>) => {
    const { data } = response
    // 1. 成功
    if (data.code === 0) {
      return data.data as unknown as AxiosResponse
    }
      // 2. 【新增逻辑】如果是“未登录”错误 (40100)，不弹窗，直接 Reject
    // 这样前端 Store 里的 catch 依然能捕获到，但用户不会看到红色的报错
    else if (data.code === 40100) {
      return Promise.reject(data)
    }
    // 3. 其他业务错误，正常弹窗
    else {
      message.error(data.message || '系统错误')
      return Promise.reject(data)
    }
  },
  (error: AxiosError<BackendResponseData>) => {
    // HTTP 状态码错误处理
    const errorMsg = error.response?.data?.message || '网络异常'
    message.error(errorMsg)
    return Promise.reject(error)
  },
)

export default myAxios
