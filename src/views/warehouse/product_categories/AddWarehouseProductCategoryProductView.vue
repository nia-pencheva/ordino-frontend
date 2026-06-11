<template>
    <TheLayout :content-styles="['add-warehouse-product-category-product']">
        <div class="add-warehouse-product-category-product__wrapper">
            <TheButton
                @click="router.back()"
                class="add-warehouse-product-category-product__back-button"
            >
                <i class="add-warehouse-product-category-product__back-button__icon"></i>
            </TheButton>

            <TheTitle>Add product to category {{ route.query.categoryName }}</TheTitle>

            <TheSearchbar
                v-model="searchName"
                placeholder="Search products..."
            />

            <div
                v-if="searchName.trim()"
                class="add-warehouse-product-category-product__results"
            >
                <div
                    v-if="!loaded"
                    class="add-warehouse-product-category-product__loader"
                >
                    <TheSpinner size="lg" />
                </div>
                <template v-else>
                    <template v-if="(productsPage?.totalElements ?? 0) > 0">
                        <div class="add-warehouse-product-category-product__table">
                            <div
                                v-for="product in productsPage?.products"
                                :key="product.id"
                                class="add-warehouse-product-category-product__row"
                            >
                                <p>{{ product.name }}</p>
                                <TheButton
                                    class="add-warehouse-product-category-product__add-button"
                                    @click="addProduct(product.id)"
                                >
                                    Add
                                </TheButton>
                            </div>
                        </div>
                        <ThePager
                            v-if="(productsPage?.totalElements ?? 0) > pageSize"
                            :current-page="currentPage"
                            :total-pages="productsPage?.totalPages"
                            @previous="getPreviousPage"
                            @next="getNextPage"
                        />
                    </template>
                    <div
                        v-else
                        class="add-warehouse-product-category-product__no-results"
                    >
                        <p>No products found</p>
                    </div>
                </template>
            </div>
        </div>
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from 'vue';

    import TheButton from '@/components/base/TheButton.vue';
    import TheLayout from '@/components/layout/TheLayout.vue';
    import ThePager from '@/components/base/ThePager.vue';
    import TheSearchbar from '@/components/base/TheSearchbar.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';

    import { useRoute, useRouter } from 'vue-router';

    import { APICall } from '@/service/api/api';

    const route = useRoute();
    const router = useRouter();

    interface AddableProduct {
        id: number
        name: string
        active: boolean
    }

    interface AddableProductsPage {
        products: AddableProduct[]
        totalElements: number
        totalPages: number
    }

    const pageSize = 10;

    const searchName = ref<string>('');
    const currentPage = ref<number>(1);
    const productsPage = ref<AddableProductsPage | undefined>(undefined);

    const loaded = computed<boolean>(() => productsPage.value !== undefined);

    let debounceTimer: ReturnType<typeof setTimeout>;

    watch(searchName, () => {
        clearTimeout(debounceTimer);
        currentPage.value = 1;
        productsPage.value = undefined;
        if (!searchName.value.trim()) return;
        debounceTimer = setTimeout(fetchProducts, 400);
    });

    async function fetchProducts() {
        const path = `warehouse-product-categories/${route.params.id}/get-addable-products?name=${encodeURIComponent(searchName.value.trim())}&page=${currentPage.value}&pageSize=${pageSize}`;
        productsPage.value = await (new APICall<AddableProductsPage>(path)).execute();

        if (productsPage.value.totalElements > 0 && productsPage.value.products.length == 0) {
            getPreviousPage();
        }
    }

    async function addProduct(productId: number) {
        productsPage.value = undefined;
        await (new APICall(`warehouse-product-categories/${route.params.id}/add-product`, 'POST', { productId })).execute();
        await fetchProducts();
    }

    async function getNextPage() {
        currentPage.value++;
        productsPage.value = undefined;
        await fetchProducts();
    }

    async function getPreviousPage() {
        currentPage.value--;
        productsPage.value = undefined;
        await fetchProducts();
    }
</script>

<style lang="scss">
    .add-warehouse-product-category-product__wrapper {
        padding: 0px 10px;
    }

    .add-warehouse-product-category-product__results {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        width: 100%;
        margin-top: 20px;
    }

    .add-warehouse-product-category-product__back-button {
        width: 24px;
        height: 24px;
        font-size: 18px;
        margin-bottom: 20px;
    }

    .add-warehouse-product-category-product__back-button__icon {
        @include arrow-left(black, 2px);

        position: relative;
        bottom: 1px;
        left: 2px;
    }

    .add-warehouse-product-category-product__loader {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: $tableMinHeight;
    }

    .add-warehouse-product-category-product__table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }

    .add-warehouse-product-category-product__row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border: 1px solid $midGray;
        border-radius: 5px;
        background-color: white;

        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1.00),
            inset 0 -1px 0 rgba(255, 255, 255, 0.40),
            inset 1px 0 0 rgba(255, 255, 255, 0.55),
            inset -1px 0 0 rgba(255, 255, 255, 0.55),
            0 1px 2px rgba(0, 0, 0, 0.20),
            0 1px 0 rgba(255, 255, 255, 0.60);

        p {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    .add-warehouse-product-category-product__add-button {
        width: 50px;
        padding: 4px;
        flex-shrink: 0;
    }

    .add-warehouse-product-category-product__no-results {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: $tableMinHeight;

        p {
            font-weight: bold;
        }
    }
</style>
