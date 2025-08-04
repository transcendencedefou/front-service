import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import fr from './locales/fr.json'
import en from './locales/en.json'
import './assets/main.css'
import router from './router/index.ts'

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
app.use(router)
app.use(i18n)
app.mount('#app')

