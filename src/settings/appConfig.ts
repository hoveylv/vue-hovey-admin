import { PermissionModeEnum } from '@/enums/appEnum'
import type { AppSetting } from '@/types/config'

const defaultSetting: AppSetting = {
  language: 'zh_CN',
  permissionMode: PermissionModeEnum.ROUTE_MAPPING,
}

export default defaultSetting
