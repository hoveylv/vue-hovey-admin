import { createI18n } from 'vue-i18n'
import type { App } from 'vue'
import zhCN from './lang/zh-CN'
import enUS from './lang/en-US'

const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  missingWarn: false,
  fallbackLocale: 'zh-CN',
  fallbackWarn: false,
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

export function setupI18n(app: App<Element>) {
  app.use(i18n)
}

export default i18n
