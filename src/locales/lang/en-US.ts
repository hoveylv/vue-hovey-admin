import enUS from 'element-plus/es/locale/lang/en'

const enUSModules = import.meta.glob(
  ['@/locales/lang/**/en-US.ts', '@/pages/**/locales/en-US.ts'],
  {
    eager: true,
  }
)

const messages = {}

for (const item in enUSModules) {
  const locale = (enUSModules[item] as any)?.default
  if (locale) Object.assign(messages, locale)
}

export default {
  ...messages,
  el: enUS,
}
