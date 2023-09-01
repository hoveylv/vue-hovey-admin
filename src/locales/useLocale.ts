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

function setI18nLanguage(lang: LocaleType) {
  const appStore = useAppStoreWithOut()
  if (i18n.mode === 'legacy') i18n.global.locale = lang
  else (i18n.global.locale as any).value = lang
  appStore.setLocale(lang)
  setHtmlPageLang(lang)
}

export function useLocale() {
  const appStore = useAppStoreWithOut()
  const language = computed(() => appStore.appSetting.language)

  const getElementPlusLocale = computed(
    () =>
      (
        i18n.global.getLocaleMessage(unref(language)) as {
          ElementPlusLocale?: any
        }
      )?.ElementPlusLocale ?? {}
  )

  async function changeLocale(locale: LocaleType) {
    const globalI18n = i18n.global
    const currentLocale = unref(globalI18n.locale)
    if (currentLocale === locale) return locale

    if (loadLocalePool.includes(locale)) {
      setI18nLanguage(locale)
      return locale
    }

    const langModule = (await import(`./lang/${locale}.ts`))
      .default as LangModule
    if (!langModule) return
    const { message } = langModule
    globalI18n.setLocaleMessage(locale, message)
    loadLocalePool.push(locale)
    setI18nLanguage(locale)
    return locale
  }

  const t = i18n.global.t as (
    key: string,
    values?: Record<string, LocaleMessageValue<VueMessageType>>
  ) => string

  return {
    language,
    changeLocale,
    getElementPlusLocale,
    t,
  }
}
