import zhCN from 'element-plus/es/locale/lang/zh-cn'
import enUS from 'element-plus/es/locale/lang/en'
import type { Language } from 'element-plus/es/locale/index'
import { store } from '..'
import appConfig from '@/configs/appConfig'
import type { LocaleType } from '@/types/config'

const LOCALE = {
  zh_CN: zhCN,
  en: enUS,
} as { [key: string]: Language }

export const useAppStore = defineStore('app', () => {
  const language = useStorage('language', appConfig.language)

  const locale = computed(() => {
    return LOCALE[language.value] ?? LOCALE.zh_CN
  })
  const changeLanguage = (val: LocaleType) => {
    language.value = val
  }
  return { locale, language, changeLanguage }
})

export function useLocaleStoreWithOut() {
  return useAppStore(store)
}
