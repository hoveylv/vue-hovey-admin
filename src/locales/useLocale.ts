import type { LocaleMessageValue, VueMessageType } from 'vue-i18n'
import { loadLocalePool, setHtmlPageLang } from './helper'
import { i18n } from '.'
import { useAppStoreWithOut } from '@/store/modules/app'
import type { LocaleType } from '@/types/config'

interface LangModule {
  message: Recordable
  dateLocale: Recordable
  dateLocaleName: string
}

// 定义一个函数，用于设置语言
function setI18nLanguage(lang: LocaleType) {
  // 获取应用程序的store
  const appStore = useAppStoreWithOut()
  // 如果是legacy模式，则将全局的locale设置为语言
  if (i18n.mode === 'legacy') i18n.global.locale = lang
  // 否则，将全局的locale设置为语言
  else (i18n.global.locale as any).value = lang
  // 设置应用程序的locale
  appStore.setLocale(lang)
  // 设置html页面的语言
  setHtmlPageLang(lang)
}

// 导出一个函数，用于获取全局的locale
export function useLocale() {
  // 获取应用程序的store
  const appStore = useAppStoreWithOut()
  // 获取当前的语言
  const language = computed(() => appStore.appSetting.language)

  // 获取全局的locale
  const getElementPlusLocale = computed(
    () =>
      (
        i18n.global.getLocaleMessage(unref(language)) as {
          ElementPlusLocale?: any
        }
      )?.ElementPlusLocale ?? {}
  )

  // 异步设置语言
  async function changeLocale(locale: LocaleType) {
    // 获取全局的i18n
    const globalI18n = i18n.global
    // 获取当前的locale
    const currentLocale = unref(globalI18n.locale)
    // 如果当前locale等于传入的locale，则直接返回
    if (currentLocale === locale) return locale

    // 如果不是legacy模式，则从语言模块中获取语言
    if (loadLocalePool.includes(locale)) {
      setI18nLanguage(locale)
      return locale
    }

    // 从语言模块中导入语言文件
    const langModule = (await import(`./lang/${locale}.ts`))
      .default as LangModule
    // 如果没有导入语言文件，则直接返回
    if (!langModule) return
    // 获取语言模块中的message
    const { message } = langModule
    // 设置全局的i18n为语言
    globalI18n.setLocaleMessage(locale, message)
    // 将语言添加到loadLocalePool中
    loadLocalePool.push(locale)
    // 设置全局的i18n为语言
    setI18nLanguage(locale)
    return locale
  }

  // 获取全局的t
  const t = i18n.global.t as (
    key: string,
    values?: Record<string, LocaleMessageValue<VueMessageType>>
  ) => string

  // 返回函数
  return {
    language,
    changeLocale,
    getElementPlusLocale,
    t,
  }
}
