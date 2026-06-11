<template>
    <TheLayout :content-styles="[ 'add-warehouse-product-category-view' ]">
        <template v-if="route.params.id">
            <div class="edit-unit-view__loader" v-if="warehouseProductCategory === undefined">
                <TheSpinner size="lg" />
            </div>
            <template v-else>
                <TheTitle style="text-align: center;">
                    Add subcategory to <br>warehouse product category <br /> {{ warehouseProductCategory?.category }}
                </TheTitle>

                <WarehouseProductCategoryForm
                    :parent-category-id="warehouseProductCategory.id"
                />
            </template>
        </template>
        <template v-else>
            <TheTitle>
                Add warehouse product category
            </TheTitle>

            <WarehouseProductCategoryForm />
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import { onMounted, ref } from 'vue';
    import { fetchWarehouseProductCategoryForEditing } from '@/components/warehouse/product_categories/warehouse-product-categories-utils';
    import { WarehouseProductCategoryForEditing } from '@/components/warehouse/product_categories/warehouse-product-categories-models';

    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import WarehouseProductCategoryForm from '@/components/warehouse/product_categories/WarehouseProductCategoryForm.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';

    const route = useRoute();

    const warehouseProductCategory = ref<WarehouseProductCategoryForEditing | undefined>(undefined);

    onMounted(async () => {
        if (route.params.id)
            warehouseProductCategory.value = await fetchWarehouseProductCategoryForEditing(parseInt(route.params.id.toString()));
    });
</script>

<style lang="scss">
    .add-warehouse-product-category-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
