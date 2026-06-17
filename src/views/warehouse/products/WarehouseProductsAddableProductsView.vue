<template>
    <TheLayout :content-styles="['warehouse-products-addable-products-view']">
        <div class="warehouse-products-addable-products-view__wrapper">
            <TheTitle>Add warehouse product</TheTitle>

            <TheSearchbar
                v-model="searchName"
                placeholder="Search products..."
            />

            <div
                v-if="searchName.trim()"
                class="warehouse-products-addable-products-view__results"
            >
                <div
                    v-if="!loaded"
                    class="warehouse-products-addable-products-view__loader"
                >
                    <TheSpinner size="lg" />
                </div>
                <template v-else>
                    <template v-if="(productsPage?.totalElements ?? 0) > 0">
                        <div class="warehouse-products-addable-products-view__table">
                            <div
                                v-for="product in productsPage?.products"
                                :key="product.id"
                                class="warehouse-products-addable-products-view__row"
                            >
                                <p>{{ product.name }}</p>
                                <TheButton
                                    class="warehouse-products-addable-products-view__add-button"
                                    @click="router.push({ name: 'add-warehouse-product', params: { id: product.id } })"
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
                        class="warehouse-products-addable-products-view__no-results"
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
    import { useRouter } from 'vue-router';
    import { APICall } from '@/service/api/api';

    import TheButton from '@/components/base/TheButton.vue';
    import TheLayout from '@/components/layout/TheLayout.vue';
    import ThePager from '@/components/base/ThePager.vue';
    import TheSearchbar from '@/components/base/TheSearchbar.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';

    import { WarehouseProductsAddableProductsPage } from '@/components/warehouse/products/warehouse-products-models';

    const router = useRouter();

    const pageSize = 10;

    const searchName = ref<string>('');
    const currentPage = ref<number>(1);
    const productsPage = ref<WarehouseProductsAddableProductsPage | undefined>(undefined);

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
        const path = `warehouse-products/addable-products?name=${encodeURIComponent(searchName.value.trim())}&page=${currentPage.value}&pageSize=${pageSize}`;
        productsPage.value = await (new APICall<WarehouseProductsAddableProductsPage>(path)).execute();

        if (productsPage.value.totalElements > 0 && productsPage.value.products.length === 0) {
            getPreviousPage();
        }
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
    .warehouse-products-addable-products-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .warehouse-products-addable-products-view__wrapper {
        width: 100%;
        padding: 0px 10px;
    }

    .warehouse-products-addable-products-view__results {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        width: 100%;
        margin-top: 20px;
    }

    .warehouse-products-addable-products-view__loader {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: $tableMinHeight;
    }

    .warehouse-products-addable-products-view__table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }

    .warehouse-products-addable-products-view__row {
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

    .warehouse-products-addable-products-view__add-button {
        width: 50px;
        padding: 4px;
        flex-shrink: 0;
    }

    .warehouse-products-addable-products-view__no-results {
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
