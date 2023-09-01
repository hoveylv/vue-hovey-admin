import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'
import 'virtual:svg-icons-register'
import '@unocss/reset/tailwind.css'
import { setupI18n } from '@/locales'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'

async function bootstap() {
  const app = createApp(App)
  setupStore(app)
  await setupI18n(app)
  setupRouter(app)
  app.mount('#app')
}

bootstap()
