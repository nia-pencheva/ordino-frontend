<template>
    <WarehouseProductCategoriesLayout>
        <div class="warehouse-product-categories-view">
            <WarehouseProductCategoriesSidebar :categories="categories" />
            <div class="warehouse-product-categories-layout__main">
                <div
                    v-if="categories == undefined"
                    class="warehouse-product-categories-layout__main__loader"
                >
                    <TheSpinner size="lg" />
                </div>
                <RouterView
                    v-else
                    v-slot="{ Component }"
                >
                    <component
                        :is="Component"
                        v-if="Component"
                    />
                    <WarehouseProductCategoriesRootDetailView
                        v-else
                    />
                </RouterView>
            </div>
        </div>
    </WarehouseProductCategoriesLayout>

    <RemoveCategoryPopup
        v-if="removeCategoryTarget"
        :category="removeCategoryTarget"
        @close="removeCategoryTarget = undefined"
        @removed-category="handleRemovedCategory"
    />

    <RemoveProductPopup
        v-if="removeProductTarget && removeProductParent"
        :parent-category="removeProductParent"
        :product="removeProductTarget"
        @close="removeProductTarget = undefined; removeProductParent = undefined"
        @removed-product="handleRemovedProduct"
    />
</template>

<script setup lang="ts">
    import { onMounted, provide, ref } from 'vue';
    import { type WarehouseProductCategory, type WarehouseProductCategoryProduct } from '@/components/warehouse/product_categories/warehouse-product-categories-models';
    import { fetchWarehouseProductCategories, findParentById } from '@/components/warehouse/product_categories/warehouse-product-categories-utils';

    import WarehouseProductCategoriesSidebar from '@/components/warehouse/product_categories/WarehouseProductCategoriesSidebar.vue';
    import WarehouseProductCategoriesLayout from '@/components/warehouse/product_categories/WarehouseProductCategoriesLayout.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import WarehouseProductCategoriesRootDetailView from './WarehouseProductCategoriesRootDetailView.vue';
    import RemoveCategoryPopup from '@/components/warehouse/product_categories/RemoveCategoryPopup.vue';
    import RemoveProductPopup from '@/components/warehouse/product_categories/RemoveProductPopup.vue';
    import router from '@/router/index';

    const categories = ref<WarehouseProductCategory[] | undefined>(undefined);

    const currentPage = ref<number>(1);

    const removeCategoryTarget = ref<WarehouseProductCategory | undefined>(undefined);

    const removeProductTarget = ref<WarehouseProductCategoryProduct | undefined>(undefined);
    const removeProductParent = ref<WarehouseProductCategory | undefined>(undefined);

    function nextPage() {
        currentPage.value++;
    }

    function previousPage() {
        currentPage.value--;
    }

    function setPage(page: number) {
        currentPage.value = page;
    }

    function openRemoveCategoryPopup(_event: MouseEvent, category: WarehouseProductCategory) {
        removeCategoryTarget.value = category;
    }

    function openRemoveProductPopup(product: WarehouseProductCategoryProduct, parentCategory: WarehouseProductCategory) {
        removeProductTarget.value = product;
        removeProductParent.value = parentCategory;
    }

    async function handleRemovedCategory() {
        const parent = findParentById(categories.value!, removeCategoryTarget.value!.id);

        if (parent !== null) {
            router.push({ name: "warehouse-product-category-detail", params: { id: parent.id } });
        } else {
            router.push({ name: "warehouse-product-categories" });
        }

        removeCategoryTarget.value = undefined;
        categories.value = await fetchWarehouseProductCategories();
    }

    async function handleRemovedProduct() {
        removeProductTarget.value = undefined;
        removeProductParent.value = undefined;
        setPage(1);
        categories.value = await fetchWarehouseProductCategories();
    }

    onMounted(async () => {
        categories.value = await fetchWarehouseProductCategories();
    });

    provide('categories', categories);
    provide('currentPage', currentPage);
    provide('nextPage', nextPage);
    provide('previousPage', previousPage);
    provide('setPage', setPage);
    provide('openRemoveCategoryPopup', openRemoveCategoryPopup);
    provide('openRemoveProductPopup', openRemoveProductPopup);
</script>

<style lang="scss">
    .warehouse-product-categories-view {
        display: flex;
        flex-direction: column;
        width: 100%;

        @include desktop() {
            flex-direction: row;
            align-items: flex-start;
        }
    }

    .warehouse-product-categories-layout__main {
        flex: 1;
        min-width: 0;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-color: white;

        @include desktop() {
            position: static;
        }
    }

    .warehouse-product-categories-layout__main__loader {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
