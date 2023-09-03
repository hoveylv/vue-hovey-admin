import ElementPlusLocale from 'element-plus/es/locale/lang/en'

// 导入模块
import { genMessage } from '../helper'

// 导入模块中的所有文件
const modules = import.meta.glob('./en/**/*.ts', { eager: true })
// 返回模块
export default {
  // 语言
  message: {
    // 将模块中的文件解析成消息
    ...genMessage(modules as Recordable<Recordable>, 'en'),
    // 引入ElementPlusLocale
    ElementPlusLocale,
  },
  // 日期语言
  dateLocale: null,
  // 日期语言名称
  dateLocaleName: 'en',
}
