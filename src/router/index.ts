import { useAuth } from "@/store/auth/auth";
import { createRouter, createWebHistory, RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: {
      guest: true
    }
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: () => import("@/views/auth/ChangePasswordView.vue"),
    meta: {
      auth: true,
      passwordRequiresChange: true
    }
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
    meta: {
      auth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(function(to: RouteLocationNormalizedGeneric, from: any, next: any) {
  const auth = useAuth();

  if(to.meta.auth && !auth.isAuthenticated) next("/login");
  else if (auth.passwordChangeRequired && to.name !== 'change-password') next({ name: 'change-password' });
  else if (to.meta.passwordRequiresChange && !auth.passwordChangeRequired) next({ name: 'home' });
  else if(to.meta.admin && !auth.user?.isAdmin()) next({ name: 'home' });
  else if(to.meta.guest && auth.isAuthenticated) next("/");
  else next();
});

export default router;
