import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'
import PongView from '../views/PongView.vue'

const routes = [
    { path: '/', 
      name: 'Home', 
      component: HomeView },
    { path: '/pong', 
      name: 'Pong Game', 
      component: PongView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;