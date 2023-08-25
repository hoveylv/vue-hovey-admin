import { createApp } from 'vue'
import App from './App.vue'
import 'uno.css'
import 'virtual:svg-icons-register'

import { setupRouter } from '@/router'
import { setupStore } from '@/store'

const app = createApp(App)
setupStore(app)
setupRouter(app)

app.mount('#app')
