import { set } from 'lodash-es'
import type { LocaleType } from '@/types/config'

// 初始化localePool
export const loadLocalePool: LocaleType[] = []

// 设置html页面语言
export function setHtmlPageLang(locale: LocaleType) {
  document.querySelector('html')?.setAttribute('lang', locale)
}

// 设置加载localePool
export function setLoadLocalePool(cb: (loadLocalePool: LocaleType[]) => void) {
  cb(loadLocalePool)
}

// 生成消息
export function genMessage(
  langs: Record<string, Record<string, any>>,
  prefix = 'lang'
) {
  const obj: Recordable = {}

  // 遍历langs
  Object.keys(langs).forEach((key) => {
    // 获取默认模块
    const langFileModule = langs[key].default
    // 获取文件名
    let fileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '')

    // 获取最后一个点
    const lastIndex = fileName.lastIndexOf('.')
    fileName = fileName.substring(0, lastIndex)
    // 获取key列表
    const keyList = fileName.split('/')
    // 获取模块名
    const moduleName = keyList.shift()
    // 获取对象键
    const objKey = keyList.join('.')

    // 如果模块名存在
    if (moduleName) {
      // 如果对象键存在
      if (objKey) {
        // 设置对象
        set(obj, moduleName, obj[moduleName] || {})
        // 设置对象键值
        set(obj[moduleName], objKey, langFileModule)
      } else {
        // 设置对象
        set(obj, moduleName, langFileModule || {})
      }
    }
  })
  // 返回对象
  return obj
}
