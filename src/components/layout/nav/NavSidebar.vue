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
                v-if="auth.user?.isAdmin()" 
                icon-src="/images/icons/user.png"
                link="/users"
            >
                Users
            </NavItem>
        </div>
    </div>
</template>

<script setup lang="ts">
    // Imports
    import { ref } from 'vue';
    import { useAuth } from '@/store/auth/auth';

    // Components
    import TheButton from '../../base/TheButton.vue';
    import NavItem from './NavItem.vue';

    // Store
    const auth = useAuth();

    // Refs
    const sidebarOpen = ref<boolean>(false);

    // Functions
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
        border-radius: 0px 8px 8px 0px;
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
</style>
