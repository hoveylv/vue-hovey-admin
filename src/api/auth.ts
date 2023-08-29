import type { AxiosPromise } from 'axios'
import type { CaptchaResult } from './types'

import http from '@/utils/http'

/**
 * 获取验证码
 */
export function getCaptchaApi(): AxiosPromise<CaptchaResult> {
  return http.get('/api/v1/auth/captcha')
}
