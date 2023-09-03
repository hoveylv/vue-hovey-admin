import type { AppRouteModule, AppRouteRecordRaw } from '../types'
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from './basic'
import { mainOutRoutes } from './mainOut'
import { PageEnum } from '@/enums/pageEnum'

// import.meta.glob() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
const routeModuleList: AppRouteModule[] = []

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  // 将modules中的key值转换为对象
  const mod = (modules as Recordable)[key].default || {}
  // 将mod转换为数组
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  // 将modList添加到routeModuleList中
  routeModuleList.push(...modList)
})
export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList]

// 跟路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
  children: [...asyncRoutes],
}

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/sys/login/index.vue'),
  meta: {
    title: '登录',
  },
}

// Basic routing without permission
// 未经许可的基本路由
export const basicRoutes = [
  LoginRoute,
  RootRoute,
  ...mainOutRoutes,

  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
]
