<template>
    <NavSidebar />
    <div class="recipe-ingredient-categories-layout">
        <TheNav />
        <div class="recipe-ingredient-categories-layout__content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import NavSidebar from '@/components/layout/nav/NavSidebar.vue';
    import TheNav from '@/components/layout/nav/TheNav.vue';    
</script>

<style lang="scss">
    .recipe-ingredient-categories-layout {
        width: 100%;
        min-height: 100vh;
    }

    .recipe-ingredient-categories-layout__content {
        display: flex;
        flex-direction: row;
        padding-top: 48px;
        padding-left: 35px;
        min-height: calc(100vh - 48px);
    }
</style>