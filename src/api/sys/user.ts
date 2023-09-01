import type {
  GetUserInfoModel,
  LoginParams,
  LoginResultModel,
} from './model/userModel'
import { http } from '@/utils/http'

import type { ErrorMessageMode } from '@/types/axios'

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
export function loginApi(
  params: LoginParams,
  mode: ErrorMessageMode = 'dialog'
) {
  return http.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    }
  )
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return http.get<GetUserInfoModel>(
    { url: Api.GetUserInfo },
    { errorMessageMode: 'none' }
  )
}

export function getPermCode() {
  return http.get<string[]>({ url: Api.GetPermCode })
}

export function doLogout() {
  return http.get({ url: Api.Logout })
}

export function testRetry() {
  return http.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    }
  )
}
