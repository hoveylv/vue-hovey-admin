import type { App } from 'vue'
import type { Locale } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import type { LocaleType } from '@/types/config'
import { useLocaleStoreWithOut } from '@/store/modules/app'

const appStore = useLocaleStoreWithOut()

const localesMap = Object.fromEntries(
  Object.entries(import.meta.glob('@/locales/langs/*.yml')).map(
    ([path, loadLocale]) => {
      return [path.match(/([\w-]*)\.yml$/)?.[1], loadLocale]
    }
  )
) as Record<Locale, () => Promise<{ default: Record<string, string> }>>

export const availableLocales = Object.keys(localesMap)

const i18n = createI18n({
  legacy: false,
  locale: '',
  messages: {},
  availableLocales,
  globalInjection: true,
})

const loadedLanguages: string[] = []

function setI18nLanguage(lang: Locale) {
  i18n.global.locale.value = lang
  if (typeof document !== 'undefined')
    document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

export async function loadLanguageAsync(lang: string): Promise<Locale> {
  if (i18n.global.locale.value === lang) return setI18nLanguage(lang)

  if (loadedLanguages.includes(lang)) return setI18nLanguage(lang)
  const messages = await localesMap[lang]()
  i18n.global.setLocaleMessage(lang, messages.default)
  loadedLanguages.push(lang)
  return setI18nLanguage(lang)
}

export async function changeLocale(locale: LocaleType) {
  appStore.changeLanguage(locale)
  await loadLanguageAsync(locale)
  if (locale === 'en') ElMessage.success('Switch Language Successful!')
  else ElMessage.success('切换语言成功！')
}

export async function setupI18n(app: App<Element>) {
  app.use(i18n)

  await loadLanguageAsync(appStore.language)
}
