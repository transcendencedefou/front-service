import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'
import router from './router/index.ts'

const app = createApp(App)

// Pinia c'est un gestionnaire d'état (donc de data) pour Vue, ça me permet de stocker des données globales,
// dans mon cas celles du jeu. Graçe a ca on peut éditer et récuperer partout sur l'app ces données
// Je peux les rendre perssistantes au refresh et au leave mais je m'en occuperai plus tard
const pinia = createPinia()
app.use(pinia)

app.use(router)
app.mount('#app')

