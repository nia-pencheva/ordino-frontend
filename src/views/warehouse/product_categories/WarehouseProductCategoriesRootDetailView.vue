<template>
    <div
        v-if="(categories ?? []).length == 0"
        class="warehouse-product-category-detail--root--no-categories"
    >
        Product categories will appear here when you add them
    </div>
    <div
        v-else
        class="warehouse-product-category-detail--root"
    >
        <TheTitle style="width: 100%;">All categories</TheTitle>

        <WarehouseProductCategorySubcategoriesTable
            :sub-categories="categories!"
        />
    </div>
</template>

<script setup lang="ts">
    import { WarehouseProductCategory } from '@/components/warehouse/product_categories/warehouse-product-categories-models';
    import { inject, Ref } from 'vue';

    import TheTitle from '@/components/layout/TheTitle.vue';
    import WarehouseProductCategorySubcategoriesTable from '@/components/warehouse/product_categories/WarehouseProductCategorySubcategoriesTable.vue';

    const categories = inject<Ref<WarehouseProductCategory[] | undefined>>('categories');
</script>

<style lang="scss">
    .warehouse-product-category-detail--root--no-categories {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }

    .warehouse-product-category-detail--root {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
</style>
