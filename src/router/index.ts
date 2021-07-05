import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Call from '../views/Call.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/call',
    name: 'Call',
    component: Call,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
