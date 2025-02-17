import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import store from '../store';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
    meta: { skipeAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { skipeAuth: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { skipeAuth: true },
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.meta.skipeAuth || store.getters.isAuthenticated) {
    next();
  } else {
    next('/login');
  }
});

export default router;
