import { iconType } from './types'
import { h, defineComponent, Component } from 'vue'
import { IconifyIconOnline, IconifyIconOffline } from '../index'

export function useRenderIcon(icon: string, attrs?: iconType): Component {
  return defineComponent({
    name: 'HoveyIcon',
    render() {
      const IconifyIcon = attrs && attrs['online'] ? IconifyIconOnline : IconifyIconOffline
      return h(IconifyIcon, {
        icon: icon,
        ...attrs,
      })
    },
  })
}
