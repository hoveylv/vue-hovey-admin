import { PermissionModeEnum } from '@/enums/appEnum'
import type { AppSetting } from '@/types/config'

// 定义默认的设置
const defaultSetting: AppSetting = {
  language: 'zh_CN',
  permissionMode: PermissionModeEnum.ROUTE_MAPPING,
}

// 导出默认设置
export default defaultSetting
