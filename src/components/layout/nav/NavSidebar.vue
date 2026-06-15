<template>
    <div 
        :class="[ sidebarOpen ? 'nav-sidebar--open' : 'nav-sidebar--closed' ]"    
    >
        <TheButton
            @click="toggleSidebar" 
            class="the-nav__open-sidebar"
        >
            <i :class="[ sidebarOpen ? 'the-nav__open-sidebar__icon--close' : 'the-nav__open-sidebar__icon--open' ]"></i>
        </TheButton>

        <div class="nav-sidebar__content">
            <NavItem
                v-if="auth.user?.hasRoles([ Role.ADMIN ])" 
                icon-src="/images/icons/user.png"
                link="/users"
                :icon-styles="[ 'nav-item__icon--users' ]"
            >
                Users
            </NavItem>
            <NavItem
                v-if="auth.user?.hasRoles([ Role.CHEF, Role.WAREHOUSE_MANAGER ])" 
                icon-src="/images/icons/products.png"
                link="/products"
                :icon-styles="[ 'nav-item__icon--products' ]"
            >
                Products
            </NavItem>
            <NavItem
                v-if="auth.user?.hasRoles([ Role.CHEF, Role.WAREHOUSE_MANAGER ])" 
                icon-src="/images/icons/units.png"
                link="/units"
                :icon-styles="[ 'nav-item__icon--units' ]"
            >
                Units
            </NavItem>
            <NavItemExpandable
                v-if="auth.user?.hasRoles([ Role.CHEF, Role.LINE_COOK ])"
                icon-src="/images/icons/recipes.png"
                :icon-styles="[ 'nav-item__icon--recipes' ]"
            >
                Recipes
                <template #submenu>
                    <NavSubItem link="/recipes">All Recipes</NavSubItem>
                    <NavSubItem link="/recipes/categories">Recipe Categories</NavSubItem>
                    <NavSubItem link="/recipes/ingredient-categories">Ingredient Categories</NavSubItem>
                </template>
            </NavItemExpandable>
            <NavItemExpandable
                v-if="auth.user?.hasRoles([ Role.WAREHOUSE_MANAGER ])"
                icon-src="/images/icons/warehouse.png"
                :icon-styles="[ 'nav-item__icon--warehouse' ]"
            >
                Warehouse
                <template #submenu>
                    <NavSubItem link="/warehouse">Stock</NavSubItem>
                    <NavSubItem link="/warehouse/products">Products</NavSubItem>
                    <NavSubItem link="/warehouse/product-categories">Product Categories</NavSubItem>
                    <NavSubItem link="/warehouse/logs">Logs</NavSubItem>
                </template>
            </NavItemExpandable>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useAuth } from '@/store/auth/auth';
    import { Role } from '@/components/users/users-models';

    import TheButton from '../../base/TheButton.vue';
    import NavItem from './NavItem.vue';
    import NavItemExpandable from './NavItemExpandable.vue';
    import NavSubItem from './NavSubItem.vue';

    const auth = useAuth();

    const sidebarOpen = ref<boolean>(false);

    function toggleSidebar() {
        sidebarOpen.value = !sidebarOpen.value;
    }
</script>

<style lang="scss">
    [class^="nav-sidebar--"] {
        @include glass-texture;
        @include glass-gray-shadow;

        position: fixed;
        z-index: 1000;
        height: 100vh;
        width: 160px;
        background-color: $midGray;
        border-right: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 0px 5px 5px 0px;
        padding: 10px 35px 10px 0px;
    }

    .nav-sidebar--closed {
        transform: translateX(-125px);
    }

    .nav-sidebar--open {
        left: 0;
    }

    .the-nav__open-sidebar {
        position: absolute;
        right: 5px;
        top: 10px;
        width: 24px;
        height: 24px;
        font-size: 18px;
    }

    .the-nav__open-sidebar__icon--open {
        @include arrow-right(black, 2px);

        position: relative;
        bottom: 1px;
        right: 1px;
    }

    .the-nav__open-sidebar__icon--close {
        @include arrow-left(black, 2px);

        position: relative;
        bottom: 1px;
        left: 1px;
    }

    .nav-sidebar__content {
        background-color: $lightGray;
        height: 100%;
        width: 100%;
    }

    .nav-item__icon {
        &--users {
            height: 12px; 
            width: 12px;
        }

        &--products {
            height: 15px;
            width: 15px;
        }

        &--units {
            height: 15px;
            width: 15px;
        }

        &--recipes {
            height: 15px;
            width: 15px;
        }

        &--warehouse {
            height: 12px;
            width: 12px;
        }
    }
</style>
