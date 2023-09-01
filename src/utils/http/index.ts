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

const transform: AxiosTransform = {
  transformResponseHook(res: AxiosResponse<Result>, options: RequestOptions) {
    const { isTransformResponse, isReturnNativeResponse } = options
    if (isReturnNativeResponse) return res
    if (!isTransformResponse) return res.data

    const { data } = res
    /// TODO: SyntaxError: Must be called at the top of a `setup` function
    const { t } = useLocale()
    if (!data) throw new Error(t('sys.api.apiRequestFailed'))

    const { code, result, message } = data

    const hasSuccess =
      data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS
    if (hasSuccess) {
      let successMsg = message
      if (isNull(successMsg) || isUnDef(successMsg) || isEmpty(successMsg))
        successMsg = t('sys.api.operationSuccess')

      if (options.successMessageMode === 'dialog') {
        ElMessageBox({
          title: t('sys.api.successTip'),
          message: successMsg,
          type: 'success',
        })
      } else if (options.successMessageMode === 'message') {
        ElMessage({
          message: successMsg,
          type: 'success',
        })
      } else if (options.successMessageMode === 'notification') {
        ElNotification({
          title: t('sys.api.successTip'),
          message: successMsg,
          type: 'success',
        })
      }
      return result
    }

    let timeoutMsg = ''
    switch (code) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = t('sys.api.timeoutMessage')
        /// Todo: 退出登录
        break
      default:
        if (message) timeoutMsg = message
    }

    if (options.errorMessageMode === 'dialog') {
      ElMessageBox({
        title: t('sys.api.errorTip'),
        message: timeoutMsg,
        type: 'error',
      })
    } else if (options.errorMessageMode === 'message') {
      ElMessage({
        message: timeoutMsg,
        type: 'error',
      })
    } else if (options.errorMessageMode === 'notification') {
      ElNotification({
        title: t('sys.api.errorTip'),
        message: timeoutMsg,
        type: 'error',
      })
    }
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

    if (joinPrefix) config.url = `${urlPrefix}${config.url}`

    if (apiUrl && isString(apiUrl)) config.url = `${apiUrl}${config.url}`

    const params = config.params || {}
    const data = config.data || false
    formatDate && data && !isString(data) && formatRequestDate(data)
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

  responseInterceptors: (res: AxiosResponse<any>) => {
    return res
  },

  responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: any) => {
    const { t } = useI18n()
    /// Todo: 记录错误
    // const errorLogStore = useErrorLogStoreWithOut();
    // errorLogStore.addAjaxErrorInfo(error);

    const { response, code, message, config } = error || {}
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none'
    const msg: string = response?.data?.error?.message ?? ''
    const err: string = error?.toString?.() ?? ''
    let errMessage = ''

    if (axios.isCancel(error)) return Promise.reject(error)

    try {
      if (code === 'ECONNABORTED' && message.includes('timeout'))
        errMessage = t('sys.api.apiTimeoutMessage')

      if (err?.includes('Network Error'))
        errMessage = t('sys.api.networkExceptionMsg')

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
            isOpenRetry: true,
            count: 5,
            waitTime: 100,
          },
        },
      },
      opts || {}
    )
  )
}

export const http = createAxios()
