import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'
import GameView from '../views/GameView.vue'
import LoginForm from '../views/LoginView.vue'
import RegisterForm from '../views/RegisterView.vue'
import PlayerStatsChart from '../views/DashboardView.vue'
import OAuthCallback from '../views/OAuthCallback.vue'

const routes = [
    { path: '/',
      name: 'Home',
      component: HomeView },
    { path: '/pong',
      name: 'Pong Game',
      component: GameView,
      meta: { hideNavbar: true } },
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
    ,{
      path: '/auth/oauth/callback',
      name: 'OAuthCallback',
      component: OAuthCallback,
      meta: { hideNavbar: true }
    }
]

const router = createRouter({
    history: createWebHistory('/app'),
    routes,
});

export default router;