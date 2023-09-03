import ElementPlusLocale from 'element-plus/es/locale/lang/zh-cn'

// 导入模块
import { genMessage } from '../helper'

// 导入模块中的所有文件
const modules = import.meta.glob('./zh-CN/**/*.ts', { eager: true })
// 返回对象
export default {
  message: {
    // 根据模块导入的文件，生成消息
    ...genMessage(modules as Recordable<Recordable>, 'zh-CN'),
    // 导入ElementPlusLocale
    ElementPlusLocale,
  },
}
