import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Call from '../views/Call.vue';
import Home from '@/views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/call',
    name: 'Call',
    component: Call,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
