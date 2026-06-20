<template>
    <div class="the-layout__loader" v-if="loggingOut">
        <TheSpinner size="lg" />
    </div>

    <template v-else>
        <NavSidebar />
        <div class="the-layout">
            <TheNav @logging-out="handleLogout" />
            <div :class="[ 'the-layout__content', ...props.contentStyles ?? '' ]">
                <slot></slot>
            </div>
        </div>
    </template>
</template>

<script setup lang="ts">
    import { useAuth } from '@/store/auth/auth';
    import router from '@/router/index';
    import { ref } from 'vue';

    import NavSidebar from '@/components/layout/nav/NavSidebar.vue';
    import TheNav from '@/components/layout/nav/TheNav.vue';
    import TheSpinner from '../base/TheSpinner.vue';

    const auth = useAuth();

    interface Props {
        contentStyles?: string[]
    };

    const props = defineProps<Props>();
        
    const loggingOut= ref<boolean>(false);

    async function handleLogout() {
        loggingOut.value = true;
        await auth.logout();
        router.replace("/login")
    }
</script>

<style lang="scss">
    .the-layout__loader {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
    }

    .the-layout {
        width: 100%;
        min-height: 100vh;
    }

    .the-layout__content {
        display: flex;
        flex-direction: column;
        max-width: 1200px;
        margin: 0 auto;
        padding: 68px 10px 20px 45px;
        min-height: 100vh;
    }
</style>