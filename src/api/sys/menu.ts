import type { getMenuListResultModel } from './model/menuModel'
import { http } from '@/utils/http'

enum Api {
  GetMenuList = '/getMenuList',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return http.get<getMenuListResultModel>({ url: Api.GetMenuList })
}
