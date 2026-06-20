import { Role } from "@/components/users/users-models";
import { useAuth } from "@/store/auth/auth";
import { useNotFound } from "@/store/not-found/not-found";
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
    path: "/current-user",
    name: "current-user",
    component: () => import("@/views/users/CurrentUserView.vue")
  },
  {
    path: "/users/:id",
    name: "user-info",
    component: () => import("@/views/users/UserInfoView.vue"),
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
    path: "/users/:id/edit",
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
    meta: {
      roles: [ Role.KITCHEN_STAFF, Role.LINE_COOK, Role.CHEF, Role.MANAGER ]
    }
  },
  {
    path: "/recipes/:id",
    name: "recipe-info",
    component: () => import("@/views/recipes/RecipeInfoView.vue"),
  },
  {
    path: "/recipes/:id/edit",
    name: "edit-recipe",
    component: () => import("@/views/recipes/EditRecipeView.vue"),
    meta: {
      roles: [ Role.LINE_COOK, Role.CHEF ]
    }
  },
  /* Log */
  {
    path: "/recipes/log/:id",
    name: "recipe-log",
    component: () => import("@/views/recipes/log/RecipeLogView.vue"),
    meta: {
      roles: [ Role.LINE_COOK, Role.CHEF ]
    }
  },
  {
    path: "/recipes/log/edit/:id",
    name: "recipe-edit-log-info",
    component: () => import("@/views/recipes/log/edit/RecipeEditLogInfoView.vue"),
    meta: {
      roles: [ Role.LINE_COOK, Role.CHEF ]
    }
  },
  {
    path: "/recipes/log/review/submitted-for-approval/:id",
    name: "recipe-review-submitted-for-approval-log-info",
    component: () => import("@/views/recipes/log/review/RecipeReviewSubmittedForApprovalLogInfoView.vue"),
    meta: {
      roles: [ Role.LINE_COOK, Role.CHEF ]
    }
  },
  {
    path: "/recipes/log/review/returned-for-revision/:id",
    name: "recipe-review-returned-for-revision-log-info",
    component: () => import("@/views/recipes/log/review/RecipeReviewReturnedForRevisionLogInfoView.vue"),
    meta: {
      roles: [ Role.LINE_COOK, Role.CHEF ]
    }
  },
  {
    path: "/recipes/log/review/approved/:id",
    name: "recipe-approved-log-info",
    component: () => import("@/views/recipes/log/review/RecipeReviewApprovedLogInfoView.vue"),
    meta: {
      roles: [ Role.LINE_COOK, Role.CHEF ]
    }
  },
  /* Recipe Categories */
  {
    path: "/recipes/categories",
    name: "recipe-categories",
    component: () => import("@/views/recipes/categories/RecipeCategoriesView.vue"),
    meta: {
      roles: [ Role.CHEF ]
    }
  },
  {
    path: "/recipes/categories/add",
    name: "add-recipe-category",
    component: () => import("@/views/recipes/categories/AddRecipeCategoryView.vue"),
    meta: {
      roles: [ Role.CHEF ]
    }
  },
  {
    path: "/recipes/categories/:id/edit",
    name: "edit-recipe-category",
    component: () => import("@/views/recipes/categories/EditRecipeCategoryView.vue"),
    meta: {
      roles: [ Role.CHEF ]
    }
  },
  /* Ingredient Categories */
  {
    path: "/recipes/ingredient-categories",
    name: "recipe-ingredient-categories",
    component: () => import("@/views/recipes/ingredient_categories/RecipeIngredientCategoriesView.vue"),
    meta: {
      roles: [ Role.CHEF, Role.LINE_COOK ]
    },
    children: [
      {
        path: ":id",
        name: "recipe-ingredient-category-detail",
        component: () => import("@/views/recipes/ingredient_categories/RecipeIngredientCategoryDetailView.vue")
      }
    ]
  },
  {
    path: "/recipes/ingredient-categories/add",
    name: "add-recipe-ingredient-category",
    component: () => import("@/views/recipes/ingredient_categories/AddRecipeIngredientCategoryView.vue"),
    meta: {
      roles: [ Role.CHEF, Role.LINE_COOK ]
    },
  },
  {
    path: "/recipes/ingredient-categories/:id/add",
    name: "add-recipe-ingredient-subcategory",
    component: () => import("@/views/recipes/ingredient_categories/AddRecipeIngredientCategoryView.vue"),
    meta: {
      roles: [ Role.CHEF, Role.LINE_COOK ]
    },
  },
  {
    path: "/recipes/ingredient-categories/:id/edit",
    name: "edit-recipe-ingredient-category",
    component: () => import("@/views/recipes/ingredient_categories/EditRecipeIngredientCategoryView.vue"),
    meta: {
      roles: [ Role.CHEF, Role.LINE_COOK ]
    },
  },
  {
    path: "/recipes/ingredient-catgories/:id/move",
    name: "move-recipe-ingredient-category",
    component: () => import("@/views/recipes/ingredient_categories/MoveRecipeIngredientCategoryView.vue"),
    meta: {
      roles: [ Role.CHEF, Role.LINE_COOK ]
    }
  },
  {
    path: "/recipes/ingredient-categories/:id/add-ingredient",
    name: "add-recipe-ingredient-category-product",
    component: () => import("@/views/recipes/ingredient_categories/AddRecipeIngredientCategoryProductView.vue"),
    meta: {
      roles: [ Role.CHEF, Role.LINE_COOK ]
    }
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
    name: "product-info",
    component: () => import("@/views/products/ProductInfoView.vue"),
    meta: {
      roles: [ Role.CHEF, Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/products/:id/edit",
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
  // Warehouse
  /* Products */
  {
    path: "/warehouse/products",
    name: "warehouse-products",
    component: () => import("@/views/warehouse/products/WarehouseProductsView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    },
  },
  {
    path: "/warehouse/products/:id",
    name: "warehouse-product-info",
    component: () => import("@/views/warehouse/products/WarehouseProductInfoView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    },
  },
  {
    path: "/warehouse/products/addable-products",
    name: "warehouse-products-addable-products",
    component: () => import("@/views/warehouse/products/WarehouseProductsAddableProductsView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    },
  },
  {
    path: "/warehouse/products/add/:id",
    name: "add-warehouse-product",
    component: () => import("@/views/warehouse/products/AddWarehouseProductView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    },
  },
  {
    path: "/warehouse/products/:id/edit",
    name: "edit-warehouse-product",
    component: () => import("@/views/warehouse/products/EditWarehouseProductView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    },
  },
  /* Warehouse Product Categories */
  {
    path: "/warehouse/product-categories",
    name: "warehouse-product-categories",
    component: () => import("@/views/warehouse/product_categories/WarehouseProductCategoriesView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    },
    children: [
      {
        path: ":id",
        name: "warehouse-product-category-detail",
        component: () => import("@/views/warehouse/product_categories/WarehouseProductCategoryDetailView.vue")
      }
    ]
  },
  {
    path: "/warehouse/product-categories/add",
    name: "add-warehouse-product-category",
    component: () => import("@/views/warehouse/product_categories/AddWarehouseProductCategoryView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    },
  },
  {
    path: "/warehouse/product-categories/:id/add",
    name: "add-warehouse-product-subcategory",
    component: () => import("@/views/warehouse/product_categories/AddWarehouseProductCategoryView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    },
  },
  {
    path: "/warehouse/product-categories/:id/edit",
    name: "edit-warehouse-product-category",
    component: () => import("@/views/warehouse/product_categories/EditWarehouseProductCategoryView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    },
  },
  {
    path: "/warehouse/product-categories/:id/move",
    name: "move-warehouse-product-category",
    component: () => import("@/views/warehouse/product_categories/MoveWarehouseProductCategoryView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/warehouse/product-categories/:id/add-product",
    name: "add-warehouse-product-category-product",
    component: () => import("@/views/warehouse/product_categories/AddWarehouseProductCategoryProductView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
  /* Suppliers */
  {
    path: "/warehouse/suppliers",
    name: "suppliers",
    component: () => import("@/views/warehouse/suppliers/SuppliersView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/warehouse/suppliers/:id",
    name: "supplier-info",
    component: () => import("@/views/warehouse/suppliers/SupplierInfoView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/warehouse/suppliers/add",
    name: "add-supplier",
    component: () => import("@/views/warehouse/suppliers/AddSupplierView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/warehouse/suppliers/:id/edit",
    name: "edit-supplier",
    component: () => import("@/views/warehouse/suppliers/EditSupplierView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/warehouse/suppliers/:supplierId/addable-products",
    name: "supplier-addable-products",
    component: () => import("@/views/warehouse/suppliers/products/SupplierAddableProductsView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/warehouse/suppliers/:supplierId/products/:supplierProductId",
    name: "supplier-product-info",
    component: () => import("@/views/warehouse/suppliers/products/SupplierProductInfoView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/warehouse/suppliers/:id/products/add",
    name: "add-supplier-product",
    component: () => import("@/views/warehouse/suppliers/products/AddSupplierProductView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/warehouse/suppliers/:supplierId/products/:supplierProductId/edit",
    name: "edit-supplier-product-info",
    component: () => import("@/views/warehouse/suppliers/products/EditSupplierProductView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
  // Orders
  {
    path: "/warehouse/orders",
    name: "orders",
    component: () => import("@/views/warehouse/orders/OrdersView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/warehouse/orders/:id",
    name: "order-info",
    component: () => import("@/views/warehouse/orders/OrderInfoView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
    {
    path: "/warehouse/orders/create",
    name: "create-order",
    component: () => import("@/views/warehouse/orders/CreateOrderView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
    {
    path: "/warehouse/orders/:id/receive",
    name: "receive-order",
    component: () => import("@/views/warehouse/orders/ReceiveOrderView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
  // Loss Reasons
  {
    path: "/warehouse/loss-reasons",
    name: "loss-reasons",
    component: () => import("@/views/warehouse/loss_reasons/LossReasonsView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/warehouse/loss-reasons/add",
    name: "add-loss-reason",
    component: () => import("@/views/warehouse/loss_reasons/AddLossReasonView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
    }
  },
  {
    path: "/warehouse/loss-reasons/:id/edit",
    name: "edit-loss-reason",
    component: () => import("@/views/warehouse/loss_reasons/EditLossReasonView.vue"),
    meta: {
      roles: [ Role.WAREHOUSE_MANAGER ]
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
  useNotFound().reset();

  if(!to.meta.guest && !auth.isAuthenticated) next("/login");
  else if(to.meta.guest && auth.isAuthenticated) next({ name: 'home' });
  else if (auth.passwordChangeRequired && to.name !== 'change-password') next({ name: 'change-password' });
  else if (to.meta.passwordRequiresChange && !auth.passwordChangeRequired) next({ name: 'home' });
  else if(to.meta.roles && !auth.user?.hasRoles(to.meta.roles as Role[])) next({ name: 'home' });
  else next();
});

export default router;
