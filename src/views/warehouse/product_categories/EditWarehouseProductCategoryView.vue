<template>
    <TheLayout :content-styles="['edit-warehouse-product-category-view']">
        <TheTitle>Edit warehouse product category</TheTitle>

        <br>

        <div class="edit-warehouse-product-category-view__loader" v-if="!loaded">
            <TheSpinner size="lg" />
        </div>

        <WarehouseProductCategoryForm
            v-else
            :warehouse-product-category="warehouseProductCategory"
            :parent-category-id="warehouseProductCategory?.parentCategoryId"
        />
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import WarehouseProductCategoryForm from '@/components/warehouse/product_categories/WarehouseProductCategoryForm.vue';
    import { WarehouseProductCategoryForEditing } from '@/components/warehouse/product_categories/warehouse-product-categories-models';
    import { fetchWarehouseProductCategoryForEditing } from '@/components/warehouse/product_categories/warehouse-product-categories-utils';

    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';

    const route = useRoute();

    const warehouseProductCategory = ref<WarehouseProductCategoryForEditing | undefined>(undefined);

    const loaded = computed<boolean>(() => warehouseProductCategory.value !== undefined);

    onMounted(async () => {
        warehouseProductCategory.value = await fetchWarehouseProductCategoryForEditing(parseInt(route.params.id as string));
    });
</script>

<style lang="scss">
    .edit-warehouse-product-category-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .edit-warehouse-product-category-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
