<template>
    <div
        v-if="category !== undefined"
        class="warehouse-product-category-detail"
    >
        <TheButton
            @click="router.back()"
            class="warehouse-product-category-detail__back-button"
        >
            <i class="warehouse-product-category-detail__back-button__icon"></i>
        </TheButton>

        <TheTitle>{{ category.category }}</TheTitle>

        <!-- Non-leaf -->
        <template v-if="!isLeaf">
            <div class="warehouse-product-category-detail__toolbar">
                <TheButton
                    class="warehouse-product-category-detail__toolbar__button"
                    @click="router.push({ name: 'add-warehouse-product-subcategory', params: { id: category.id } })"
                >
                    Add Subcategory
                </TheButton>
                <TheButton
                    class="warehouse-product-category-detail__toolbar__button"
                    @click="router.push({ name: 'edit-warehouse-product-category', params: { id: category.id } })"
                >
                    Edit
                </TheButton>
                <TheButton
                    class="warehouse-product-category-detail__toolbar__button"
                    @click.stop="router.push({ name: 'move-warehouse-product-category', params: { id: category.id } })"
                >
                    Move
                </TheButton>
                <TheButton
                    class="warehouse-product-category-detail__toolbar__button"
                    type="important"
                    @click="openRemoveCategoryPopup($event, category)"
                >
                    Delete
                </TheButton>
            </div>

            <SectionTitle>Subcategories</SectionTitle>

            <WarehouseProductCategorySubcategoriesTable
                :sub-categories="category.subCategories!"
            />

            <p class="warehouse-product-category-detail__note">
                Products are set only at the leaf category level. Click on a subcategory in the tree on the left to get to the leaf level.
            </p>
        </template>

        <!-- Leaf with no products -->
        <template v-else-if="!hasProducts">
            <div class="warehouse-product-category-detail__toolbar">
                <TheButton
                    class="warehouse-product-category-detail__toolbar__button"
                    @click="router.push({ name: 'add-warehouse-product-subcategory', params: { id: category.id } })"
                >
                    Add Subcategory
                </TheButton>
                <TheButton
                    class="warehouse-product-category-detail__toolbar__button"
                    @click="router.push({ name: 'add-warehouse-product-category-product', params: { id: category.id }, query: { categoryName: category.category } })"
                >
                    Add Product
                </TheButton>
                <TheButton
                    class="warehouse-product-category-detail__toolbar__button"
                    @click.stop="router.push({ name: 'move-warehouse-product-category', params: { id: category.id } })"
                >
                    Move
                </TheButton>
                <TheButton
                    class="warehouse-product-category-detail__toolbar__button"
                    @click="router.push({ name: 'edit-warehouse-product-category', params: { id: category.id } })"
                >
                    Edit
                </TheButton>
                <TheButton
                    class="warehouse-product-category-detail__toolbar__button"
                    type="important"
                    @click="openRemoveCategoryPopup($event, category)"
                >
                    Delete
                </TheButton>
            </div>

            <div class="warehouse-product-category-detail__empty">
                <p>No products or subcategories have been added yet</p>
            </div>
        </template>

        <!-- Leaf with products -->
        <template v-else>
            <div class="warehouse-product-category-detail__toolbar">
                <TheButton
                    class="warehouse-product-category-detail__toolbar__button"
                    @click="router.push({ name: 'add-warehouse-product-category-product', params: { id: category.id }, query: { categoryName: category.category } })"
                >
                    Add Product
                </TheButton>
                <TheButton
                    class="warehouse-product-category-detail__toolbar__button"
                    @click.stop="router.push({ name: 'move-warehouse-product-category', params: { id: category.id } })"
                >
                    Move
                </TheButton>
                <TheButton
                    class="warehouse-product-category-detail__toolbar__button"
                    @click="router.push({ name: 'edit-warehouse-product-category', params: { id: category.id } })"
                >
                    Edit
                </TheButton>
                <TheButton
                    class="warehouse-product-category-detail__toolbar__button"
                    type="important"
                    @click="openRemoveCategoryPopup($event, category)"
                >
                    Delete
                </TheButton>
            </div>

            <SectionTitle>Products</SectionTitle>

            <div class="warehouse-product-category-detail__products-wrapper">
                <div class="warehouse-product-category-detail__products">
                    <WarehouseProductCategoryProductRow
                        v-for="product in pagedProducts"
                        :key="product.id"
                        :product="product"
                        :parent-category="category"
                    />
                </div>

                <ThePager
                    v-if="totalProductPages > 1"
                    :current-page="currentPage"
                    :total-pages="totalProductPages"
                    @previous="previousPage"
                    @next="nextPage"
                />
            </div>
        </template>

    </div>
</template>

<script setup lang="ts">
    import { ref, computed, inject, watch, type Ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { type WarehouseProductCategory, type WarehouseProductCategoryProduct } from '@/components/warehouse/product_categories/warehouse-product-categories-models';
    import { findCategoryById } from '@/components/warehouse/product_categories/warehouse-product-categories-utils';
    import router from '@/router';

    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheButton from '@/components/base/TheButton.vue';
    import ThePager from '@/components/base/ThePager.vue';
    import WarehouseProductCategorySubcategoriesTable from '@/components/warehouse/product_categories/WarehouseProductCategorySubcategoriesTable.vue';
    import WarehouseProductCategoryProductRow from '@/components/warehouse/product_categories/WarehouseProductCategoryProductRow.vue';
    import SectionTitle from '@/components/base/SectionTitle.vue';
    import { useNotFound } from '@/store/not-found/not-found';

    const route = useRoute();

    const categories = inject<Ref<WarehouseProductCategory[] | undefined>>('categories');
    const currentPage = inject<Ref<number>>("currentPage")!;
    const nextPage = inject<() => void>("nextPage")!;
    const previousPage = inject<() => void>("previousPage")!;
    const setPage = inject<(page: number) => void>("setPage")!;

    const productPageSize = 10;

    const category = ref<WarehouseProductCategory | undefined>(undefined);

    const isLeaf = computed(() => !category.value?.subCategories?.length);

    const hasProducts = computed(() => (category.value?.products?.length ?? 0) > 0);

    const products = computed<WarehouseProductCategoryProduct[]>(() => {
        return category.value?.products ?? [];
    });

    const totalProductPages = computed(() =>
        Math.ceil(products.value.length / productPageSize)
    );

    const pagedProducts = computed(() =>
        products.value.slice(
            (currentPage.value - 1) * productPageSize,
            currentPage.value * productPageSize
        )
    );

    watch(() => route.params.id, async (id) => {
        setPage(1);

        const found = findCategoryById(categories?.value ?? [], Number(id));

        if (found == undefined) {
            useNotFound().show();
            return;
        }

        category.value = found;
    }, { immediate: true });

    watch(() => categories?.value, () => {
        category.value = findCategoryById(categories?.value ?? [], Number(route.params.id));
    });

    const openRemoveCategoryPopup: (event: MouseEvent, category: WarehouseProductCategory) => void = inject('openRemoveCategoryPopup')!;
</script>

<style lang="scss">
    .warehouse-product-category-detail {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .warehouse-product-category-detail__back-button {
        width: 24px;
        height: 24px;
        margin: 20px 0px;
        font-size: 18px;

        @include desktop() {
            display: none
        }
    }

    .warehouse-product-category-detail__back-button__icon {
        @include arrow-left(black, 2px);

        position: relative;
        bottom: 1px;
        left: 2px;
    }

    .warehouse-product-category-detail__toolbar {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 5px;
        margin-bottom: 20px;
    }

    .warehouse-product-category-detail__toolbar__button {
        width: 130px;
        padding: 4px 10px;
    }

    .warehouse-product-category-detail__products-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .warehouse-product-category-detail__products {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }

    .warehouse-product-category-detail__empty {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        text-align: center;

        p {
            font-weight: bold;
        }
    }

    .warehouse-product-category-detail__note {
        margin-top: 20px;
        color: #888;
        font-style: italic;
    }
</style>
