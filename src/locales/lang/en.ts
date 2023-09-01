import ElementPlusLocale from 'element-plus/es/locale/lang/en'
import { genMessage } from '../helper'

const modules = import.meta.glob('./en/**/*.ts', { eager: true })
export default {
  message: {
    ...genMessage(modules as Recordable<Recordable>, 'en'),
    ElementPlusLocale,
  },
  dateLocale: null,
  dateLocaleName: 'en',
}
