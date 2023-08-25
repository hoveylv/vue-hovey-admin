export type ErrorMessageMode = 'none' | 'modal' | 'message' | 'undefined'
export type SuccessMessageMode = ErrorMessageMode

export interface RequestOptions {
  // 是否将请求参数拼接到Url
  joinParamsToUrl?: boolean
  // 格式化请求参数中的时间
  formatDate?: boolean
  // 是否处理请求结果
  isTransformRespons?: boolean
  // 是否返回原生的响应标头
  // 例如：当您需要获取响应标头时，请使用此属性
  isReturnNativeResponse?: boolean
  // 是否拼接Url
  joinPrefix?: boolean
  // 接口地址，如果不赋值则使用默认的apiUrl
  apiUrl?: string
  // 请求拼接路径
  urlPrefix?: string
  // 错误消息提示方式
  errorMessageMode?: ErrorMessageMode
  // 成功消息提示方式
  successMessageMode?: SuccessMessageMode
  // 是否添加时间戳
  joinTime?: boolean
  // 避免取消请求
  ignoreCancelToken?: boolean
  // 是否在请求头加入token
  withToken?: boolean
  // 请求重试机制
  retryRequest?: RetryRequest
}

export interface RetryRequest {
  isOpenRetry: boolean
  count: number
  waitTime: number
}

export interface Result<T = any> {
  code: number
  // type: 'success' | 'error' | 'warning'
  msg: string
  data: T
}
