import ElementPlusLocale from 'element-plus/es/locale/lang/zh-cn'
import { genMessage } from '../helper'

const modules = import.meta.glob('./zh-CN/**/*.ts', { eager: true })
export default {
  message: {
    ...genMessage(modules as Recordable<Recordable>, 'zh-CN'),
    ElementPlusLocale,
  },
}
