import zhCN from 'element-plus/es/locale/lang/zh-cn'

const zhCNModules = import.meta.glob(
  ['@/locales/lang/**/zh-CN.ts', '@/pages/**/locales/en-US.ts'],
  {
    eager: true,
  }
)

const messages = {}

for (const item in zhCNModules) {
  const locale = (zhCNModules[item] as any)?.default
  if (locale) Object.assign(messages, locale)
}

export default {
  ...messages,
  el: zhCN,
}
