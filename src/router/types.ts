import type { RouteMeta, RouteRecordRaw } from 'vue-router'

// 导出组件类型
export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

// @ts-expect-error Unreachable code error
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  // 路由名称
  name: string
  // 路由元数据
  meta: RouteMeta
  // 组件
  component?: Component | string
  // 组件
  components?: Component
  // 子路由
  children?: AppRouteRecordRaw[]
  // 属性
  props?: Recordable
  // 完整路径
  fullPath?: string
}

// 导出AppRouteModule类型
export type AppRouteModule = AppRouteRecordRaw
