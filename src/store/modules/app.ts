import { store } from '..'
import type { AppSetting, LocaleType } from '@/types/config'
import defaultSetting from '@/settings/appConfig'

// 定义一个useAppStore函数，用于获取应用程序的状态
export const useAppStore = defineStore('app', () => {
  // 从本地存储中获取应用程序设置
  const appSetting = useStorage<AppSetting>('appSettings', defaultSetting)

  // 设置语言
  const setLocale = (lang: LocaleType) => {
    appSetting.value.language = lang
  }

  return { appSetting, setLocale }
})

// 定义一个useAppStoreWithOut函数，用于获取应用程序的状态，并返回store
export function useAppStoreWithOut() {
  // 返回store，并传入store
  return useAppStore(store)
}
