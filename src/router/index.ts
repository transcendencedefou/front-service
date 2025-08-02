import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PongView from '../views/PongView.vue'
import LoginForm from '../views/LoginView.vue'

const routes = [
    { path: '/', 
      name: 'Home', 
      component: HomeView },
    { path: '/pong', 
      name: 'Pong Game', 
      component: PongView },
    { path: '/login',
      name: 'Login',
      component: LoginForm}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router