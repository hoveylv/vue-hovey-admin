import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'

export interface MyAxiosConfig extends AxiosRequestConfig {
  enableRetry?: boolean
  maxRetryAttempts?: number
  retryInterval?: number
  enableCancelDuplicate?: boolean
  // 添加其他配置项...
}

export class MyAxios {
  private axiosInstance: AxiosInstance
  private enableRetry: boolean
  private maxRetryAttempts: number
  private retryInterval: number
  private enableCancelDuplicate: boolean
  private abortControllers: Map<string, AbortController> = new Map()
  private requestFilters: ((
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig)[] = []

  private responseFilters: ((response: AxiosResponse) => AxiosResponse)[] = []

  constructor(config: Partial<MyAxiosConfig>) {
    // 解构配置项
    this.enableRetry =
      config.enableRetry !== undefined ? config.enableRetry : true
    this.maxRetryAttempts =
      config.maxRetryAttempts !== undefined ? config.maxRetryAttempts : 3
    this.retryInterval =
      config.retryInterval !== undefined ? config.retryInterval : 1000
    this.enableCancelDuplicate =
      config.enableCancelDuplicate !== undefined
        ? config.enableCancelDuplicate
        : true

    // 合并配置项，创建 Axios 实例
    const mergedAxiosConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...(config.headers || {}),
      },
    }
    this.axiosInstance = axios.create(mergedAxiosConfig)

    // 设置取消重复请求的拦截器
    if (this.enableCancelDuplicate) this.setupCancelDuplicateInterceptor()
  }

  // 设置取消重复请求的拦截器
  private setupCancelDuplicateInterceptor() {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.enableCancelDuplicate) {
          const requestKey = `${config.method}-${config.url}`
          if (this.abortControllers.has(requestKey)) {
            // 如果存在重复请求，则取消前一个请求
            const abortController = this.abortControllers.get(requestKey)
            abortController?.abort()
          }
          const abortController = new AbortController()
          config.signal = abortController.signal
          this.abortControllers.set(requestKey, abortController)
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (this.enableCancelDuplicate) {
          const requestKey = `${response.config.method}-${response.config.url}`
          this.abortControllers.delete(requestKey)
        }
        return response
      },
      (error) => {
        if (this.enableCancelDuplicate) {
          const requestKey = `${error.config.method}-${error.config.url}`
          this.abortControllers.delete(requestKey)
        }
        return Promise.reject(error)
      }
    )
  }

  // 添加请求过滤器
  addRequestFilter(
    filter: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  ) {
    this.requestFilters.push(filter)
  }

  // 添加响应过滤器
  addResponseFilter(filter: (response: AxiosResponse) => AxiosResponse) {
    this.responseFilters.push(filter)
  }

  // 应用请求过滤器
  private applyRequestFilters(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    let modifiedConfig = config
    for (const filter of this.requestFilters)
      modifiedConfig = filter(modifiedConfig)

    return modifiedConfig
  }

  // 应用响应过滤器
  private applyResponseFilters(response: AxiosResponse): AxiosResponse {
    let modifiedResponse = response
    for (const filter of this.responseFilters)
      modifiedResponse = filter(modifiedResponse)
    return modifiedResponse
  }

  // 发送通用请求
  async request<R>(
    config: InternalAxiosRequestConfig
  ): Promise<AxiosResponse<R>> {
    // 合并默认配置和传入的配置
    const modifiedConfig: InternalAxiosRequestConfig = {
      ...(config || {}),
      headers: {
        ...(config?.headers || {}),
      } as AxiosRequestHeaders, // 添加类型注释
    }

    // 应用请求过滤器
    const finalConfig = this.applyRequestFilters(modifiedConfig)

    // 发送请求并处理响应
    return this.sendRequestWithRetry<R>(() =>
      this.axiosInstance.request<R>(finalConfig)
    ).then((response) => this.applyResponseFilters(response))
  }

  // 发送 GET 请求
  async get<R>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<AxiosResponse<R>> {
    // 合并默认配置和传入的配置
    const modifiedConfig: InternalAxiosRequestConfig = {
      ...(config || {}), // 将 config 转换为对象，以防它为 undefined
      headers: {
        ...(config?.headers || {}),
      } as AxiosRequestHeaders, // 添加类型注释
    }

    // 应用请求过滤器
    const finalConfig = this.applyRequestFilters(modifiedConfig)
    // 发送请求并处理响应
    return this.sendRequestWithRetry<R>(() =>
      this.axiosInstance.get<R>(url, finalConfig)
    ).then((response) => this.applyResponseFilters(response))
  }

  // 发送 POST 请求
  async post<R>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<AxiosResponse<R>> {
    // 合并默认配置和传入的配置
    const modifiedConfig: InternalAxiosRequestConfig = {
      ...(config || {}),
      headers: {
        ...(config?.headers || {}),
      } as AxiosRequestHeaders, // 添加类型注释
    }

    // 应用请求过滤器
    const finalConfig = this.applyRequestFilters(modifiedConfig)

    // 发送请求并处理响应
    return this.sendRequestWithRetry<R>(() =>
      this.axiosInstance.post<R>(url, data, finalConfig)
    ).then((response) => this.applyResponseFilters(response))
  }

  // 发送 PUT 请求
  async put<R>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<AxiosResponse<R>> {
    // 合并默认配置和传入的配置
    const modifiedConfig: InternalAxiosRequestConfig = {
      ...(config || {}),
      headers: {
        ...(config?.headers || {}),
      } as AxiosRequestHeaders, // 添加类型注释
    }

    // 应用请求过滤器
    const finalConfig = this.applyRequestFilters(modifiedConfig)

    // 发送请求并处理响应
    return this.sendRequestWithRetry<R>(() =>
      this.axiosInstance.put<R>(url, data, finalConfig)
    ).then((response) => this.applyResponseFilters(response))
  }

  // 发送 DELETE 请求
  async delete<R>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<AxiosResponse<R>> {
    // 合并默认配置和传入的配置
    const modifiedConfig: InternalAxiosRequestConfig = {
      ...(config || {}),
      headers: {
        ...(config?.headers || {}),
      } as AxiosRequestHeaders, // 添加类型注释
    }

    // 应用请求过滤器
    const finalConfig = this.applyRequestFilters(modifiedConfig)

    // 发送请求并处理响应
    return this.sendRequestWithRetry<R>(() =>
      this.axiosInstance.delete<R>(url, finalConfig)
    ).then((response) => this.applyResponseFilters(response))
  }

  // 发送请求并支持重试
  private sendRequestWithRetry<R>(
    requestFunction: () => Promise<AxiosResponse<R>>,
    retryCount = 0
  ): Promise<AxiosResponse<R>> {
    return requestFunction().catch(async (error) => {
      if (this.enableRetry && retryCount < this.maxRetryAttempts) {
        // 等待一段时间后重试
        await new Promise((resolve) => setTimeout(resolve, this.retryInterval))
        return this.sendRequestWithRetry(requestFunction, retryCount + 1)
      } else {
        // 重试达到最大次数或禁用重试时，返回错误
        return Promise.reject(error)
      }
    })
  }

  // 取消所有请求
  cancelRequest(): void {
    for (const [, controller] of this.abortControllers) controller.abort()

    this.abortControllers.clear()
  }
}

export default MyAxios
