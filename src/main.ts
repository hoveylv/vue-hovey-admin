import { createApp } from 'vue'
import App from '@/App.vue'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import { setupI18n } from '@/plugins/setupI18n'
import { setupMotion } from '@/plugins/setupMotion'

import Login from '@/views/login/index.vue'

const app = createApp(Login)

setupI18n(app)
setupMotion(app)

app.mount('#app')
