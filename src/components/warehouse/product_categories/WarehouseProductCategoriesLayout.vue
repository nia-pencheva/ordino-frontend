<template>
    <NavSidebar />
    <div class="warehouse-product-categories-layout">
        <TheNav />
        <div class="warehouse-product-categories-layout__content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import NavSidebar from '@/components/layout/nav/NavSidebar.vue';
    import TheNav from '@/components/layout/nav/TheNav.vue';
</script>

<style lang="scss">
    .warehouse-product-categories-layout {
        width: 100%;
        min-height: 100vh;
    }

    .warehouse-product-categories-layout__content {
        display: flex;
        flex-direction: row;
        padding-top: 48px;
        padding-left: 35px;
        min-height: calc(100vh - 48px);
    }
</style>
