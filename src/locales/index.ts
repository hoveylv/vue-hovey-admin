import { createI18n } from 'vue-i18n'
import type { App } from 'vue'
import zhCN from './lang/zh-CN'

export const defaultLocale = 'zh-CN'

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  missingWarn: false,
  fallbackLocale: defaultLocale,
  fallbackWarn: false,
  messages: {
    'zh-CN': zhCN,
  },
})

export function setupI18n(app: App<Element>) {
  app.use(i18n)
}

export default i18n
