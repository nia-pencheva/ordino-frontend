<template>
    <TheLayout :content-styles="['add-product-view']">
        <TheTitle>Add product</TheTitle>

        <ProductForm />
    </TheLayout>
</template>

<script setup lang="ts">
    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import ProductForm from '@/components/products/ProductForm.vue';
</script>

<style lang="scss">
    .add-product-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
