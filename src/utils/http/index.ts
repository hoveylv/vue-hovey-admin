import { MyAxios, type MyAxiosConfig } from './MyAxios'

const axiosConfig: MyAxiosConfig = {
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
  baseURL: import.meta.env.VITE_APP_TARGET_URL,
  timeout: 50000,
  enableCancelDuplicate: true,
  enableRetry: true,
  retryInterval: 1000,
  maxRetryAttempts: 3,
}

const axios = new MyAxios(axiosConfig)

axios.addRequestFilter((config) => {
  const token = 'your-auth-token' // 请替换为实际的授权令牌
  config.headers.Authorization = `Bearer ${token}`
  return config
})

axios.addResponseFilter((response) => {
  // 在这里您可以根据响应数据进行自定义处理
  if (response.status === 200 && response.data) {
    // 修改响应数据的示例：在响应数据中添加一个新的属性
    response.data.data.customProperty =
      'This is a custom property added to the response data'
  }
  return response.data
})

export default axios
