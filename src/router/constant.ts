export const REDIRECT_NAME = 'Redirect'

// 导出父布局名称
export const PARENT_LAYOUT_NAME = 'ParentLayout'

// 导出页面未找到名称
export const PAGE_NOT_FOUND_NAME = 'PageNotFound'

// 导出异常组件
export const EXCEPTION_COMPONENT = () =>
  import('@/views/sys/exception/Exception.vue')

// 导出布局
export const LAYOUT = () => import('@/layouts/AppLayout.vue')

// 获取父布局
export const getParentLayout = (_name?: string) => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: _name || PARENT_LAYOUT_NAME,
      })
    })
}
