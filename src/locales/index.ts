import type { I18nOptions } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import type { App } from 'vue'
import { setHtmlPageLang, setLoadLocalePool } from './helper'
import { useAppStoreWithOut } from '@/store/modules/app'

// eslint-disable-next-line import/no-mutable-exports
export let i18n: ReturnType<typeof createI18n>

async function createI18nOptions(): Promise<I18nOptions> {
  const appStore = useAppStoreWithOut()
  const locale = appStore.appSetting.language
  const defaultLocale = await import(`./lang/${locale}.ts`)
  const message = defaultLocale.default?.message ?? {}

  setHtmlPageLang(locale)
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

export async function setupI18n(app: App<Element>) {
  const options = await createI18nOptions()
  i18n = createI18n(options)
  app.use(i18n)
}
