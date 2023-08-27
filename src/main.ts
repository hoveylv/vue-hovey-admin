import { createApp } from 'vue'
import App from './App.vue'
import 'uno.css'
import 'virtual:svg-icons-register'

import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { setupI18n } from '@/locales'

const app = createApp(App)
setupStore(app)
setupRouter(app)
setupI18n(app)

app.mount('#app')
