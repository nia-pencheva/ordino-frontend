<template>
    <div class="the-nav__horizontal-strip">
        <NavBreadcrumbs />
        <TheButton
            @click="handleLogout"
            class="the-nav__logout-button"
        >
            Logout
        </TheButton>
    </div>
</template>

<script setup lang="ts">
    import router from '@/router';
    import { useAuth } from '@/store/auth/auth';

    import TheButton from '../../base/TheButton.vue';
    import NavBreadcrumbs from './NavBreadcrumbs.vue';

    const auth = useAuth();

    async function handleLogout() {
        await auth.logout();
        router.replace("/login")
    }
</script>

<style lang="scss">
    .the-nav__horizontal-strip {
        @include glass-texture;
        @include glass-gray-shadow;
        
        z-index: 900;
        position: fixed;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 10px 10px 10px 45px;
        background-color: $lightGray;
    }

    .the-nav__logout-button {
        width: 75px;
        padding: 4px;
    }
</style>
