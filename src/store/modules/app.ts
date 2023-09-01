import { store } from '..'
import type { AppSetting, LocaleType } from '@/types/config'
import defaultSetting from '@/settings/appConfig'

export const useAppStore = defineStore('app', () => {
  const appSetting = useStorage<AppSetting>('appSettings', defaultSetting)

  const setLocale = (lang: LocaleType) => {
    appSetting.value.language = lang
  }

  return { appSetting, setLocale }
})

export function useAppStoreWithOut() {
  return useAppStore(store)
}
