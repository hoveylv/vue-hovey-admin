import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import qs from 'qs'
import { cloneDeep } from 'lodash-es'
import { isFunction } from '../is'
import type { CreateAxiosOptions } from './AxiosTransform'
import { AxiosCanceler } from './AxiosCancel'
import type { RequestOptions, Result, UploadFileParams } from '@/types/axios'
import { ContentTypeEnum, RequestEnum } from '@/enums/httpEnum'

export class MyAxios {
  private axiosInstance: AxiosInstance
  // 声明一个只读属性，用于存储Axios实例
  private readonly options: CreateAxiosOptions

  constructor(options: CreateAxiosOptions) {
    // 将options传入，并将其赋值给this.options
    this.options = options
    // 使用axios.create方法创建Axios实例
    this.axiosInstance = axios.create(options)
    // 调用setupInterceptors方法
    this.setupInterceptors()
  }

  // 创建Axios实例
  private createAxios(config: CreateAxiosOptions): void {
    this.axiosInstance = axios.create(config)
  }

  // 获取转换函数
  private getTransform() {
    const { transform } = this.options
    return transform
  }

  // 获取Axios实例
  getAxios(): AxiosInstance {
    return this.axiosInstance
  }

  configAxios(config: CreateAxiosOptions) {
    // 如果axios实例不存在，则返回
    if (!this.axiosInstance) return

    // 创建axios实例
    this.createAxios(config)
  }

  // 设置请求头
  setHeader(headers: any): void {
    // 如果axios实例不存在，则返回
    if (!this.axiosInstance) return

    // 使用Object.assign()方法将headers赋值给axios实例的headers属性
    Object.assign(this.axiosInstance.defaults.headers, headers)
  }

  /**
   * 拦截器配置
   */
  private setupInterceptors() {
    const {
      axiosInstance,
      options: { transform },
    } = this
    // 如果transform参数为空，则返回
    if (!transform) return

    // 声明一个变量，用于存储请求拦截器和请求拦截器捕获器
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform

    // 创建一个AxiosCanceler实例
    const axiosCanceler = new AxiosCanceler()

    // 使用axios实例的拦截器
    this.axiosInstance.interceptors.request.use(
      // 如果requestInterceptors参数为空，则返回
      (config: InternalAxiosRequestConfig) => {
        // 声明一个变量，用于存储请求选项
        const { requestOptions } = this.options
        // 声明一个变量，用于标识是否忽略取消令牌
        const ignoreCancelToken = requestOptions?.ignoreCancelToken ?? true
        // 如果忽略取消令牌为false，则添加请求取消令牌
        !ignoreCancelToken && axiosCanceler.add(config)

        // 如果requestInterceptors参数为空，则返回
        if (requestInterceptors && isFunction(requestInterceptors))
          // 将请求参数传入requestInterceptors函数，并传入this.options参数
          config = requestInterceptors(config, this.options)
        // 返回请求参数
        return config
      },
      // 如果requestInterceptors参数不为空，则添加请求拦截器
      undefined
    )

    // 如果requestInterceptorsCatch参数不为空，则添加请求拦截器捕获器
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(
        undefined,
        requestInterceptorsCatch
      )

    // 使用axios实例的响应拦截器
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      // 如果res参数不为空，则移除请求取消令牌
      res && axiosCanceler.remove(res.config)
      // 如果responseInterceptors参数为空，则返回
      if (responseInterceptors && isFunction(responseInterceptors))
        // 将响应参数传入responseInterceptors函数
        res = responseInterceptors(res)

      // 返回响应参数
      return res
    }, undefined)
    // 如果responseInterceptorsCatch参数不为空，则添加响应拦截器捕获器
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, (error) => {
        // 将响应参数传入responseInterceptorsCatch函数，并传入axiosInstance参数和error参数
        return responseInterceptorsCatch(axiosInstance, error)
      })
  }

  // 上传文件
  uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
    // 创建表单数据
    const formData = new FormData()
    // 设置文件名
    const customFileName = params.name || 'file'

    // 如果有文件名，则将文件名添加到表单数据中
    if (params.filename)
      formData.append(customFileName, params.file, params.filename)
    // 否则将文件添加到表单数据中
    else formData.append(customFileName, params.file)

    // 如果有数据，则将数据添加到表单数据中
    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data![key]
        // 如果是数组，则遍历数组，将数据添加到表单数据中
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item)
          })
          return
        }

        // 否则，将数据添加到表单数据中
        formData.append(key, params.data![key])
      })
    }

    // 返回请求
    return this.axiosInstance.request<T>({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': ContentTypeEnum.FORM_DATA,
        ignoreCancelToken: true,
      },
    })
  }

  supportFormData(config: AxiosRequestConfig) {
    // 获取请求头
    const headers = config.headers || this.options.headers
    // 获取请求体类型
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    // 如果请求体类型不是表单，或者请求方法不是GET，则返回config
    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === RequestEnum.GET
    )
      return config

    // 否则返回一个新的config，将config.data转换为qs.stringify格式
    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
    }
  }

  // 获取指定类型的响应
  get<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    // 返回一个新的Promise对象
    return this.request({ ...config, method: 'GET' }, options)
  }

  // 发送POST请求
  post<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    // 返回一个新的Promise对象
    return this.request({ ...config, method: 'POST' }, options)
  }

  // 发送PUT请求
  put<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    // 返回一个新的Promise对象
    return this.request({ ...config, method: 'PUT' }, options)
  }

  // 发送DELETE请求
  delete<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    // 返回一个新的Promise对象
    return this.request({ ...config, method: 'DELETE' }, options)
  }

  // 发送请求
  request<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    // 克隆config
    let conf: CreateAxiosOptions = cloneDeep(config)

    // 如果config中有cancelToken，则将其赋值给conf
    if (config.cancelToken) conf.cancelToken = config.cancelToken

    // 获取transform
    const transform = this.getTransform()

    // 获取requestOptions
    const { requestOptions } = this.options

    // 将transform赋值给opt
    const opt: RequestOptions = Object.assign({}, requestOptions, options)

    // 如果transform存在，则将transform函数传入
    const { beforeRequestHook, requestCatchHook, transformResponseHook } =
      transform || {}
    if (beforeRequestHook && isFunction(beforeRequestHook))
      conf = beforeRequestHook(conf, opt)

    // 将opt赋值给conf
    conf.requestOptions = opt

    // 如果transformResponseHook存在，则将transformResponseHook函数传入
    conf = this.supportFormData(conf)

    // 返回一个新的Promise对象
    return new Promise((resolve, reject) => {
      // 调用axiosInstance的request方法
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          // 如果transformResponseHook存在，则将transformResponseHook函数传入
          if (transformResponseHook && isFunction(transformResponseHook)) {
            try {
              const ret = transformResponseHook(res, opt)
              resolve(ret)
            } catch (err) {
              reject(err || new Error('request error!'))
            }
            return
          }
          // 将res赋值给res
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          // 如果requestCatchHook存在，则将requestCatchHook函数传入
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt))
            return
          }
          // 如果e是Axios错误，则重写Axios错误提示
          if (axios.isAxiosError(e)) {
            /// todo: 重写Axios错误提示
          }
          reject(e)
        })
    })
  }
}
