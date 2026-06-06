import { Role } from "@/components/users/users-models";
import { useAuth } from "@/store/auth/auth";
import { createRouter, createWebHistory, RouteLocationNormalizedGeneric, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  // Auth
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
      passwordRequiresChange: true
    }
  },
  // Home
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  // Users
  {
    path: "/users",
    name: "users",
    component: () => import("@/views/users/UsersView.vue"),
    meta: {
      roles: [ Role.ADMIN ]
    }
  },
  {
    path: "/users/add",
    name: "add-user",
    component: () => import("@/views/users/AddUserView.vue"),
    meta: {
      roles: [ Role.ADMIN ]
    }
  },
  {
    path: "/users/:id",
    name: "edit-user",
    component: () => import("@/views/users/EditUserView.vue"),
    meta: {
      roles: [ Role.ADMIN ]
    }
  },
  // Recipes
  {
    path: "/recipes",
    name: "recipes",
    component: () => import("@/views/recipes/RecipesView.vue"),
  },
  // Products
  {
    path: "/products",
    name: "products",
    component: () => import("@/views/products/ProductsView.vue"),
    meta: {
      roles: [ Role.CHEF, Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/products/add",
    name: "add-product",
    component: () => import("@/views/products/AddProductView.vue"),
    meta: {
      roles: [ Role.CHEF, Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/products/:id",
    name: "edit-product",
    component: () => import("@/views/products/EditProductView.vue"),
    meta: {
      roles: [ Role.CHEF, Role.WAREHOUSE_MANAGER ]
    }
  },
  // Units
  {
    path: "/units",
    name: "units",
    component: () => import("@/views/units/UnitsView.vue"),
    meta: {
      roles: [ Role.CHEF, Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/units/add",
    name: "add-unit",
    component: () => import("@/views/units/AddUnitView.vue"),
    meta: {
      roles: [ Role.CHEF, Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/units/:id",
    name: "edit-unit",
    component: () => import("@/views/units/EditUnitView.vue"),
    meta: {
      roles: [ Role.CHEF, Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/unit-categories/add",
    name: "add-unit-category",
    component: () => import("@/views/units/AddUnitCategoryView.vue"),
    meta: {
      roles: [ Role.CHEF, Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/unit-categories/:id",
    name: "edit-unit-category",
    component: () => import("@/views/units/EditUnitCategoryView.vue"),
    meta: {
      roles: [ Role.CHEF, Role.WAREHOUSE_MANAGER ]
    }
  },
  // Not found
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFoundView.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(function(to: RouteLocationNormalizedGeneric, from: any, next: any) {
  const auth = useAuth();

  if(!to.meta.guest && !auth.isAuthenticated) next("/login");
  else if(to.meta.guest && auth.isAuthenticated) next({ name: 'home' });
  else if (auth.passwordChangeRequired && to.name !== 'change-password') next({ name: 'change-password' });
  else if (to.meta.passwordRequiresChange && !auth.passwordChangeRequired) next({ name: 'home' });
  else if(to.meta.roles && !auth.user?.hasRoles(to.meta.roles as Role[])) next({ name: 'home' });
  else next();
});

export default router;
