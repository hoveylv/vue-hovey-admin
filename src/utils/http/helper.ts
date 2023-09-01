import { isObject, isString } from '../is'

import { useLocale } from '@/locales/useLocale'
import type { ErrorMessageMode } from '@/types/axios'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function joinTimestamp<T extends boolean>(
  join: boolean,
  restful: T
): T extends true ? string : object
export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) return restful ? '' : {}
  const now = new Date().getTime()
  if (restful) return `?_t=${now}`

  return { _t: now }
}

/**
 * 格式化一个包含日期时间字符串的对象
 */
export function formatRequestDate(params: Recordable) {
  if (Object.prototype.toString.call(params) !== '[object Object]') return

  for (const key in params) {
    const format = params[key]?.format ?? null
    if (format && typeof format === 'function')
      params[key] = params[key].format(DATE_TIME_FORMAT)

    if (isString(key)) {
      const value = params[key]
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value
        } catch (error: any) {
          throw new Error(error)
        }
      }
    }
    if (isObject(params[key])) formatRequestDate(params[key])
  }
}

const { t } = useLocale()

export function checkStatus(
  status: number,
  msg: string,
  errorMessageMode: ErrorMessageMode = 'message'
): void {
  let errMessage = ''
  switch (status) {
    case 400:
      errMessage = `${msg}`
      break
    case 401:
      /// Todo: 清空token
      errMessage = msg || t('sys.api.errMsg401')
      break
    case 403:
      errMessage = t('sys.api.errMsg403')
      break
    case 404:
      errMessage = t('sys.api.errMsg404')
      break
    case 405:
      errMessage = t('sys.api.errMsg405')
      break
    case 408:
      errMessage = t('sys.api.errMsg408')
      break
    case 500:
      errMessage = t('sys.api.errMsg500')
      break
    case 501:
      errMessage = t('sys.api.errMsg501')
      break
    case 502:
      errMessage = t('sys.api.errMsg502')
      break
    case 503:
      errMessage = t('sys.api.errMsg503')
      break
    case 504:
      errMessage = t('sys.api.errMsg504')
      break
    case 505:
      errMessage = t('sys.api.errMsg505')
      break
    default:
  }

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
  }
}
