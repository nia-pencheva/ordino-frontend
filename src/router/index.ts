import { useAuth } from "@/store/auth/auth";
import { createRouter, createWebHistory, RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
    meta: {
      guest: true
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
  else if(to.meta.admin && !auth.user?.isAdmin()) return { name: 'Forbidden' };
  else if(to.meta.guest && auth.isAuthenticated) next("/");
  else next();
});

export default router;
