import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import type { App } from 'vue'
import { basicRoutes } from './routes'
import type { AppRouteRecordRaw } from './types'

// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = []
// 遍历AppRouteRecordRaw数组，获取路由名称
const getRouteNames = (array: AppRouteRecordRaw[]) =>
  array.forEach((item) => {
    WHITE_NAME_LIST.push(item.name)
    // 如果item有子路由，则递归调用getRouteNames函数
    getRouteNames(item.children || [])
  })
// 调用getRouteNames函数，获取基本路由
getRouteNames(basicRoutes)

export const router = createRouter({
  // 创建一个web版本的history
  history: createWebHashHistory(),
  // 将basicRoutes作为参数传入
  routes: basicRoutes as unknown as RouteRecordRaw[],
  // 是否应该禁止尾部斜杠。默认为假
  strict: true,
  // 使用scrollBehavior函数设置滚动位置
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function resetRouter() {
  // 遍历路由，清除不在WHITE_NAME_LIST中的路由
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name as string))
      router.hasRoute(name) && router.removeRoute(name)
  })
}

export function setupRouter(app: App<Element>) {
  // 使用router
  app.use(router)
}
