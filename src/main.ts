import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import 'virtual:uno.css'
import 'virtual:svg-icons-register'
import '@unocss/reset/tailwind.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/dark.scss'
import { setupI18n } from '@/locales'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'

// 异步加载
async function bootstap() {
  const app = createApp(App)
  // 初始化store
  setupStore(app)
  // 初始化i18n
  await setupI18n(app)
  // 初始化路由
  setupRouter(app)

  // 导入MotionPlugin插件
  app.use(MotionPlugin)

  // 挂载app
  app.mount('#app')
}

// 异步加载
bootstap()
