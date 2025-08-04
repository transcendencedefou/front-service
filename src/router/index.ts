import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PongView from '../views/PongView.vue'
import LoginForm from '../views/LoginView.vue'
import RegisterForm from '../views/RegisterView.vue'

const routes = [
    { path: '/',
      name: 'Home',
      component: HomeView },
    { path: '/pong',
      name: 'Pong Game',
      component: PongView },
    { path: '/login',
      name: 'Login',
      component: LoginForm},
    {
      path: '/register',
      name: 'Register',
      component: RegisterForm}
]

const router = createRouter({
    history: createWebHistory('/app'),
    routes,
})

export default router