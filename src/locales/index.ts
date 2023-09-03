import type { I18nOptions } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import type { App } from 'vue'
import { setHtmlPageLang, setLoadLocalePool } from './helper'
import { useAppStoreWithOut } from '@/store/modules/app'

// eslint-disable-next-line import/no-mutable-exports
export let i18n: ReturnType<typeof createI18n>

// 创建VueI18n实例
async function createI18nOptions(): Promise<I18nOptions> {
  const appStore = useAppStoreWithOut()
  const locale = appStore.appSetting.language
  const defaultLocale = await import(`./lang/${locale}.ts`)
  const message = defaultLocale.default?.message ?? {}

  // 设置页面语言
  setHtmlPageLang(locale)
  // 设置加载语言池
  setLoadLocalePool((loadLocalePool) => {
    loadLocalePool.push(locale)
  })

  return {
    legacy: false,
    locale,
    messages: {
      [locale]: message,
    },
    sync: true,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
    globalInjection: true,
  }
}

// 初始化VueI18n实例
export async function setupI18n(app: App<Element>) {
  const options = await createI18nOptions()
  i18n = createI18n(options)
  app.use(i18n)
}
