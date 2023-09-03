import type { AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'
import { clone } from 'lodash-es'
import { isEmpty, isNull, isString, isUnDef } from '../is'
import { deepMerge, setObjToUrlParams } from '..'
import { MyAxios } from './MyAxios'
import type { AxiosTransform, CreateAxiosOptions } from './AxiosTransform'
import { checkStatus, formatRequestDate, joinTimestamp } from './helper'
import { AxiosRetry } from './AxiosRetry'
import type { RequestOptions, Result } from '@/types/axios'
import { useLocale } from '@/locales/useLocale'
import { ContentTypeEnum, RequestEnum, ResultEnum } from '@/enums/httpEnum'

const urlPrefix = ''
const { t } = useLocale()

const transform: AxiosTransform = {
  transformResponseHook(res: AxiosResponse<Result>, options: RequestOptions) {
    // 获取options中的isTransformResponse和isReturnNativeResponse
    const { isTransformResponse, isReturnNativeResponse } = options
    // 如果是返回原始响应，直接返回
    if (isReturnNativeResponse) return res
    // 如果不是返回原始响应，则检查是否需要转换响应
    if (!isTransformResponse) return res.data

    // 获取响应数据
    const { data } = res
    // 如果没有数据，抛出错误
    if (!data) throw new Error(t('sys.api.apiRequestFailed'))

    // 获取响应结果
    const { code, result, message } = data

    // 检查是否有成功码
    const hasSuccess =
      data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS
    // 如果有成功码，则设置成功提示
    if (hasSuccess) {
      let successMsg = message
      // 如果没有提示信息，则设置默认提示信息
      if (isNull(successMsg) || isUnDef(successMsg) || isEmpty(successMsg))
        successMsg = t('sys.api.operationSuccess')

      // 如果是弹出框模式，则弹出框
      if (options.successMessageMode === 'dialog') {
        ElMessageBox({
          title: t('sys.api.successTip'),
          message: successMsg,
          type: 'success',
        })
        // 如果是消息模式，则消息
      } else if (options.successMessageMode === 'message') {
        ElMessage({
          message: successMsg,
          type: 'success',
        })
        // 如果是通知模式，则通知
      } else if (options.successMessageMode === 'notification') {
        ElNotification({
          title: t('sys.api.successTip'),
          message: successMsg,
          type: 'success',
        })
      }
      // 返回结果
      return result
    }

    // 检查是否有超时码
    let timeoutMsg = ''
    switch (code) {
      // 如果是超时码，则设置超时提示
      case ResultEnum.TIMEOUT:
        timeoutMsg = t('sys.api.timeoutMessage')
        /// Todo: 退出登录
        break
      // 其他情况，则设置默认提示信息
      default:
        if (message) timeoutMsg = message
    }

    // 如果是弹出框模式，则弹出框
    if (options.errorMessageMode === 'dialog') {
      ElMessageBox({
        title: t('sys.api.errorTip'),
        message: timeoutMsg,
        type: 'error',
      })
      // 如果是消息模式，则消息
    } else if (options.errorMessageMode === 'message') {
      ElMessage({
        message: timeoutMsg,
        type: 'error',
      })
      // 如果是通知模式，则通知
    } else if (options.errorMessageMode === 'notification') {
      ElNotification({
        title: t('sys.api.errorTip'),
        message: timeoutMsg,
        type: 'error',
      })
    }
    // 抛出错误
    throw new Error(timeoutMsg || t('sys.api.apiRequestFailed'))
  },

  beforeRequestHook: (config, options) => {
    const {
      apiUrl,
      joinPrefix,
      joinParamsToUrl,
      formatDate,
      joinTime = true,
      urlPrefix,
    } = options

    // 如果joinPrefix存在，则将config.url设置为urlPrefix + config.url
    if (joinPrefix) config.url = `${urlPrefix}${config.url}`

    // 如果apiUrl存在，则将config.url设置为apiUrl + config.url
    if (apiUrl && isString(apiUrl)) config.url = `${apiUrl}${config.url}`

    // 如果config.params存在，则将config.params设置为config.params
    const params = config.params || {}
    const data = config.data || false
    // 如果formatDate存在，则将data设置为data，并将formatDate设置为true
    formatDate && data && !isString(data) && formatRequestDate(data)
    // 如果config.method为get，则将config.params设置为undefined
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(
          params || {},
          joinTimestamp(joinTime, false)
        )
      } else {
        // 兼容restful风格
        config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    } else {
      // 如果config.params不存在，则将formatDate设置为true，并将config.params设置为data
      if (!isString(params)) {
        formatDate && formatRequestDate(params)
        if (
          Reflect.has(config, 'data') &&
          config.data &&
          (Object.keys(config.data).length > 0 ||
            config.data instanceof FormData)
        ) {
          config.data = data
          config.params = params
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params
          config.params = undefined
        }
        if (joinParamsToUrl) {
          // 将config.params设置为url + params
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data)
          )
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },

  // 请求之前处理config
  /// Todo: token相关
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    /// Todo: token相关
    const token = 'this is faker token.'
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      ;(config as Recordable).headers.Authorization =
        options.authenticationScheme
          ? `${options.authenticationScheme} ${token}`
          : token
    }
    return config
  },

  // 响应之前处理res
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res
  },

  // 定义一个函数，用于捕获响应拦截器
  responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: any) => {
    /// Todo: 记录错误
    // const errorLogStore = useErrorLogStoreWithOut();
    // errorLogStore.addAjaxErrorInfo(error);

    const { response, code, message, config } = error || {}
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none'
    const msg: string = response?.data?.error?.message ?? ''
    const err: string = error?.toString?.() ?? ''
    let errMessage = ''

    // 如果是取消错误，则直接抛出
    if (axios.isCancel(error)) return Promise.reject(error)

    try {
      // 如果是网络错误，则提示网络异常
      if (code === 'ECONNABORTED' && message.includes('timeout'))
        errMessage = t('sys.api.apiTimeoutMessage')

      // 如果是网络错误，则提示网络异常
      if (err?.includes('Network Error'))
        errMessage = t('sys.api.networkExceptionMsg')

      // 如果有错误信息，则根据错误信息模式进行提示
      if (errMessage) {
        if (errorMessageMode === 'dialog') {
          ElMessageBox({
            title: t('sys.api.errorTip'),
            message: errMessage,
            type: 'error',
          })
        } else if (errorMessageMode === 'message') {
          ElMessage({
            message: errMessage,
            type: 'error',
          })
        } else if (errorMessageMode === 'notification') {
          ElNotification({
            title: t('sys.api.errorTip'),
            message: errMessage,
            type: 'error',
          })
        }
        return Promise.reject(error)
      }
    } catch (error) {
      throw new Error(error as unknown as string)
    }

    // 检查响应状态
    checkStatus(error?.response?.status, msg, errorMessageMode)

    // 添加自动重试机制 保险起见 只针对GET请求
    const retryRequest = new AxiosRetry()
    const { isOpenRetry } = config.requestOptions.retryRequest
    config.method?.toUpperCase() === RequestEnum.GET &&
      isOpenRetry &&
      retryRequest.retry(axiosInstance, error)
    return Promise.reject(error)
  },
}

// 创建一个axios实例
function createAxios(opts?: Partial<CreateAxiosOptions>) {
  return new MyAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 10 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,

        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: clone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: import.meta.env.VITE_GLOB_API_URL,
          // 接口拼接地址
          urlPrefix,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          retryRequest: {
            // 是否开启重试
            isOpenRetry: true,
            // 是否设置重试次数
            count: 5,
            // 是否设置重试等待时间
            waitTime: 100,
          },
        },
      },
      opts || {}
    )
  )
}

// 将createAxios()函数赋值给http
export const http = createAxios()
