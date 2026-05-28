<template>
    <div class="the-nav__horizontal-strip">
        <div></div>
        <TheButton 
            @click="handleLogout"
            class="the-nav__logout-button"
        >
            Logout
        </TheButton>
    </div>
</template>

<script setup lang="ts">
    // Imports
    import router from '@/router';
    import { useAuth } from '@/store/auth/auth';

    // Components
    import TheButton from '../../base/TheButton.vue';

    // Store
    const auth = useAuth();

    async function handleLogout() {
        await auth.logout();
        router.replace("/login")
    }
</script>

<style lang="scss">
    .the-nav__horizontal-strip {
        position: fixed;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 10px;
        background-color: $lightGray;
        border-bottom: 1px solid $lightGrayBorder;
    }

    .the-nav__logout-button {
        width: 75px;
        padding: 4px;
    }
</style>
