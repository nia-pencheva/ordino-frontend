<template>
    <TheLayout>
        <TheTitle>Products</TheTitle>

        <div class="products-view__toolbar">
            <TheSearchbar
                v-model="searchName"
                placeholder="Search by name..."
            />

            <TheButton
                @click="router.push('/products/add')"
                class="products-view__add-button"
            >
                Add
            </TheButton>
        </div>

        <div class="products-view__tabs">
            <div
                @click="active = true" 
                :class="[ 'products-view__tab', { 'products-view__tab--active': active } ]"
            >
                Active
            </div>
            <div 
                @click="active = false" 
                :class="[ 'products-view__tab', { 'products-view__tab--active': !active } ]"
            >
                Inactive
            </div>
        </div>

        
        <div class="products-view__tab__wrapper">
            <div
                v-if="!loaded" 
                class="products-view__loader"
            >
                <TheSpinner size="lg"/>
            </div>
            <template v-else>
                <div 
                    v-if="productsPage?.totalElements != 0"
                    class="products-view__results"
                >
                    <ProductsTable
                        :products="productsPage?.products"
                        @activated-product="handleActivated"
                        @open-deactivate-popup="openDeactivatePopup"
                        @open-delete-popup="openDeletePopup"
                    />
                    <ThePager
                        v-if="(productsPage?.totalElements ?? 0) > pageSize"
                        :current-page="currentPage"
                        :total-pages="productsPage?.totalPages"
                        @previous="getPreviousPage()"
                        @next="getNextPage()"
                    />
                </div>

                <div
                    v-else
                    class="products-view__not-results"
                >
                    <p>No products found</p>
                </div>
            </template>
        </div>
        <DeactivateProductPopup
            v-if="deactivatePopup != undefined"
            :product="deactivatePopup"
            @close="deactivatePopup = undefined"
            @deactivated-product="handleDeactivated"
        />

        <DeleteProductPopup
            v-if="deletePopup != undefined"
            :product="deletePopup"
            @close="deletePopup = undefined"
            @deleted-product="handleDeleted"
        />
    </TheLayout>
</template>

<script setup lang="ts">
    import router from '@/router';
    import { computed, onMounted, ref, watch } from 'vue';
    import { Product, ProductsPage } from '@/components/products/products-models';
    import { APICall } from '@/service/api/api';

    import TheButton from '@/components/base/TheButton.vue';
    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheSearchbar from '@/components/base/TheSearchbar.vue';
    import ProductsTable from '@/components/products/ProductsTable.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import DeactivateProductPopup from '@/components/products/DeactivateProductPopup.vue';
    import DeleteProductPopup from '@/components/products/DeleteProductPopup.vue';
    import ThePager from '@/components/base/ThePager.vue';

    const pageSize = 10;

    const productsPage = ref<ProductsPage | undefined>(undefined);
    const searchName = ref<string>('');
    const active = ref<boolean>(true);
    const currentPage = ref<number>(1);

    const deactivatePopup = ref<Product | undefined>(undefined);
    const deletePopup = ref<Product | undefined>(undefined);

    const loaded = computed<boolean>(() => productsPage.value != undefined);

    let debounceTimer: ReturnType<typeof setTimeout>;

    watch(searchName, () => {
        clearTimeout(debounceTimer);
        currentPage.value = 1;
        productsPage.value = undefined;
        debounceTimer = setTimeout(fetchProducts, 400);
    });

    watch(active, () => {
        currentPage.value = 1;
        productsPage.value = undefined;
        fetchProducts();
    });

    function openDeactivatePopup(product: Product) {
        deactivatePopup.value = product;
    }

    function openDeletePopup(product: Product) {
        deletePopup.value = product;
    }

    async function handleActivated() {
        await fetchProducts();
    }

    async function handleDeactivated() {
        deactivatePopup.value = undefined;
        currentPage.value = 1;
        await fetchProducts();
    }

    async function handleDeleted() {
        deletePopup.value = undefined;
        currentPage.value = 1;
        await fetchProducts();
    }

    async function fetchProducts() {
        let path = `products?active=${active.value}&page=${currentPage.value}`;

        if (searchName.value.trim()) {
            path += `&name=${encodeURIComponent(searchName.value.trim())}`;
        }

        productsPage.value = await (new APICall<ProductsPage>(path)).execute();
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

    onMounted(async () => {
        await fetchProducts();
    });
</script>

<style lang="scss">
    .products-view__toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        width: 100%;
        margin-bottom: 20px;
    }

    .products-view__add-button {
        width: 75px;
        padding: 4px;
        flex-shrink: 0;
    }

    .products-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .products-view__tabs {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        width: 100%;
        border-bottom: 1px solid $lightGrayBorder;
        padding-top: 4px;
    }

    .products-view__tab {
        padding: 5px 16px;
        cursor: pointer;
        border: 1px solid $lightGrayBorder;
        border-bottom: none;
        border-radius: 4px 4px 0 0;
        background: $darkGray;
        color: #888;
        font-size: 14px;
        user-select: none;
        margin-right: 2px;

        &:hover:not(.products-view__tab--active) {
            background: darken($darkGray, 4%);
        }

        &--active {
            background: white;
            color: $fontColorMain;
            position: relative;
            z-index: 1;
            margin-bottom: -1px;
            border: 1px solid #9d9d9d;
            border-bottom: 1px solid white;
            clip-path: inset(-10px -10px 0px -10px);

            @include glass-gray-shadow();
        }
    }

    .products-view__results {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .products-view__tab__wrapper {
        flex: 1;
        display: flex;
        padding: 15px 5px 5px;
        clip-path: inset(-10px 0px 1px 1px);

        @include glass-gray-shadow();
    }

    .products-view__not-results {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        
        p {
            font-weight: bold;
        }
    }
</style>
