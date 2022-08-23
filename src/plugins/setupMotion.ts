import { MotionPlugin } from '@vueuse/motion'
import type { App } from 'vue'

export function setupMotion(app: App) {
  app.use(MotionPlugin)
}
