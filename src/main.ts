import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import fr from './locales/fr.json'
import en from './locales/en.json'
import './assets/main.css'
import router from './router/index.ts'
import { useAuthStore } from './stores/auth.ts'

const i18n = createI18n({
    legacy: false, // obliogatoire en compo API
    locale: 'fr-FR',
    fallbackLocale: 'en-US',
    messages: { 
      'fr-FR': fr,
      'en-US': en,
    },
})

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
const auth = useAuthStore()
auth.loadUserFromLocalStorage()

app.use(router)
app.use(i18n)
app.mount('#app')

