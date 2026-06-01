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
    // Import
    import NavSidebar from '@/components/layout/nav/NavSidebar.vue';
    import TheNav from '@/components/layout/nav/TheNav.vue';

    // Props
    interface Props {
        contentStyles?: string[]
    };

    const props = defineProps<Props>();
</script>

<style lang="scss">
    .the-layout {
        width: 100%;
        height: 100%;
    }

    .the-layout__content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px 10px 20px 45px;
        min-height: calc(100vh - 48px);
    }
</style>