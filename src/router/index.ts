import { createRouter, createWebHistory } from 'vue-router';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import HomeView from '../views/HomeView.vue'
import GameView from '../views/GameView.vue'
import LoginForm from '../views/LoginView.vue'
import RegisterForm from '../views/RegisterView.vue'
import PlayerStatsChart from '../views/DashboardView.vue'
import OAuthCallback from '../views/OAuthCallback.vue'
import TournamentsView from '../views/TournamentsView.vue'
import CGUView from '../views/CGUView.vue'
import { useAuthStore } from '../stores/auth';

const routes = [
    { path: '/',
      name: 'Home',
      component: HomeView,
      meta: { public: true } },
    { path: '/game',
      name: 'Game',
      component: GameView,
      meta: { hideNavbar: true } },
    { path: '/auth/login',
      name: 'Login',
      component: LoginForm,
      meta: { public: true }},
    {
      path: '/auth/register',
      name: 'Register',
      component: RegisterForm,
      meta: { public: true }},
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: PlayerStatsChart},
    {
      path: '/tournaments',
      name: 'Tournaments',
      component: TournamentsView},
    {
      path: '/cgu',
      name: 'CGU',
      component: CGUView,
      meta: { public: true }
    },
    {
      path: '/auth/oauth/callback',
      name: 'OAuthCallback',
      component: OAuthCallback,
      meta: { hideNavbar: true, public: true }
    },
    { path: '/tournament/match/:matchId', name: 'TournamentMatch', component: GameView, meta: { hideNavbar: true } },
]

const router = createRouter({
    history: createWebHistory('/app'),
    routes,
});

// Guard global d'authentification
router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (to.matched.some((r: any) => (r.meta as any).public)) return next();
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) return next({ path: '/auth/login', query: { redirect: to.fullPath } });
  next();
});

export default router;