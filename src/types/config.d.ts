import { PermissionModeEnum } from '@/enums/appEnum'

export type LocaleType = 'zh_CN' | 'en'

export interface AppSetting {
  // 国际化语言
  language: LocaleType
  // 权限模式
  permissionMode: PermissionModeEnum
}
