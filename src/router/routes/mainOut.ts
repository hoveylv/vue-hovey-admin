/**
The routing of this file will not show the layout.
It is an independent new page.
the contents of the file still need to log in to access
 */
import type { AppRouteModule } from '@/router/types'

// test
// http:ip:port/main-out
export const mainOutRoutes: AppRouteModule[] = [
  {
    // 路由路径
    path: '/main-out',
    // 路由名称
    name: 'MainOut',
    // 路由组件
    component: () => import('@/views/demo/main-out/index.vue'),
    // 路由元数据
    meta: {
      // 标题
      title: 'MainOut',
      // 是否忽略权限
      ignoreAuth: true,
    },
  },
]

// 获取路由名称
export const mainOutRouteNames = mainOutRoutes.map((item) => item.name)
