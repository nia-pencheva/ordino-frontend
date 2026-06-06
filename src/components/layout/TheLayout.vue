<template>
    <NavSidebar />
    <div class="the-layout">
        <TheNav />
        <div :class="[ 'the-layout__content', ...props.contentStyles ?? '' ]">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import NavSidebar from '@/components/layout/nav/NavSidebar.vue';
    import TheNav from '@/components/layout/nav/TheNav.vue';

    interface Props {
        contentStyles?: string[]
    };

    const props = defineProps<Props>();
</script>

<style lang="scss">
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
        min-height: calc(100vh - 48px);
    }
</style>