<template>
    <div class="the-nav__horizontal-strip">
        <NavBreadcrumbs />

        <div class="the-nav__horizontal-strip__right">
            <RouterLink 
                :to="{ name: 'current-user' }"
                class="the-nav__horizontal-strip__current-user-link"
            >
                {{ auth.user?.name }}
            </RouterLink>
            <TheButton
                @click="emit('logging-out')"
                class="the-nav__logout-button"
            >
                Logout
            </TheButton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useAuth } from '@/store/auth/auth';

    import TheButton from '../../base/TheButton.vue';
    import NavBreadcrumbs from './NavBreadcrumbs.vue';

    const auth = useAuth();

    const emit = defineEmits([ "logging-out" ]);
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

    .the-nav__horizontal-strip__right {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }

    .the-nav__horizontal-strip__current-user-link {
        color: $fontColorMain;
        opacity: 0.55;

        &:hover {
            opacity: 1;
        }
    }

    .the-nav__logout-button {
        width: 75px;
        padding: 4px;
    }
</style>
