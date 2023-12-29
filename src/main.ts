import App from './App.vue'
import '@/assets/style.css'

import { createApp } from 'vue'

import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
