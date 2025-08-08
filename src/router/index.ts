import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'
import PongView from '../views/PongView.vue'
import LoginForm from '../views/LoginView.vue'
import RegisterForm from '../views/RegisterView.vue'
import PlayerStatsChart from '../views/DashboardView.vue'

const routes = [
    { path: '/',
      name: 'Home',
      component: HomeView },
    { path: '/pong',
      name: 'Pong Game',
      component: PongView },
    { path: '/auth/login',
      name: 'Login',
      component: LoginForm},
    {
      path: '/auth/register',
      name: 'Register',
      component: RegisterForm},
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: PlayerStatsChart}
]

const router = createRouter({
    history: createWebHistory('/app'),
    routes,
});

export default router;