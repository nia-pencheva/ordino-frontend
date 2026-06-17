<template>
    <TheLayout>
        <TheTitle>Warehouse Products</TheTitle>

        <div class="warehouse-products-view__toolbar">
            <TheSearchbar
                v-model="searchName"
                placeholder="Search by name..."
            />

            <TheButton
                @click="router.push({ name: 'warehouse-products-addable-products' })"
                class="warehouse-products-view__add-button"
            >
                Add
            </TheButton>
        </div>

        <div class="warehouse-products-view__tabs">
            <div
                @click="tab = 'active'"
                :class="[ 'warehouse-products-view__tab', { 'warehouse-products-view__tab--active': tab === 'active' } ]"
            >
                Active
            </div>
            <div
                @click="tab = 'inactive'"
                :class="[ 'warehouse-products-view__tab', { 'warehouse-products-view__tab--active': tab === 'inactive' } ]"
            >
                Deactivated
            </div>
            <div
                @click="tab = 'toAdd'"
                :class="[ 'warehouse-products-view__tab', { 'warehouse-products-view__tab--active': tab === 'toAdd' } ]"
            >
                To Add
            </div>
        </div>

        <div class="warehouse-products-view__tab__wrapper">
            <div
                v-if="!loaded"
                class="warehouse-products-view__loader"
            >
                <TheSpinner size="lg"/>
            </div>
            <template v-else>
                <div
                    v-if="totalElements != 0"
                    class="warehouse-products-view__results"
                >
                    <WarehouseProductsTable
                        v-if="tab !== 'toAdd'"
                        :warehouse-products="warehouseProductsPage?.warehouseProducts"
                    />
                    <WarehouseProductsAddableTable
                        v-else
                        :products="addableProductsPage?.products"
                    />

                    <ThePager
                        v-if="totalElements > pageSize"
                        :current-page="currentPage"
                        :total-pages="totalPages"
                        @previous="getPreviousPage()"
                        @next="getNextPage()"
                    />
                </div>

                <div
                    v-else
                    class="warehouse-products-view__not-results"
                >
                    <p>No products found</p>
                </div>
            </template>
        </div>
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';

    import { WarehouseProductsAddableProductsPage, WarehouseProductsPage } from '@/components/warehouse/products/warehouse-products-models';
    import { APICall } from '@/service/api/api';

    import TheButton from '@/components/base/TheButton.vue';
    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheSearchbar from '@/components/base/TheSearchbar.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import ThePager from '@/components/base/ThePager.vue';
    import WarehouseProductsTable from '@/components/warehouse/products/WarehouseProductsTable.vue';
    import WarehouseProductsAddableTable from '@/components/warehouse/products/WarehouseProductsAddableTable.vue';

    const router = useRouter();

    type Tab = 'active' | 'inactive' | 'toAdd';

    const pageSize = 10;

    const tab = ref<Tab>('active');
    const searchName = ref<string>('');
    const currentPage = ref<number>(1);
    const warehouseProductsPage = ref<WarehouseProductsPage | undefined>(undefined);
    const addableProductsPage = ref<WarehouseProductsAddableProductsPage | undefined>(undefined);

    const loaded = computed<boolean>(() =>
        tab.value === 'toAdd' ? addableProductsPage.value != undefined : warehouseProductsPage.value != undefined
    );

    const totalElements = computed<number>(() =>
        tab.value === 'toAdd' ? (addableProductsPage.value?.totalElements ?? 0) : (warehouseProductsPage.value?.totalElements ?? 0)
    );

    const totalPages = computed<number | undefined>(() =>
        tab.value === 'toAdd' ? addableProductsPage.value?.totalPages : warehouseProductsPage.value?.totalPages
    );

    let debounceTimer: ReturnType<typeof setTimeout>;

    watch(searchName, () => {
        clearTimeout(debounceTimer);
        currentPage.value = 1;
        resetPages();
        debounceTimer = setTimeout(fetchProducts, 400);
    });

    watch(tab, () => {
        currentPage.value = 1;
        resetPages();
        fetchProducts();
    });

    function resetPages() {
        warehouseProductsPage.value = undefined;
        addableProductsPage.value = undefined;
    }

    async function fetchProducts() {
        if (tab.value === 'toAdd') {
            await fetchAddableProducts();
        } else {
            await fetchWarehouseProducts();
        }
    }

    async function fetchWarehouseProducts() {
        let path = `warehouse-products?active=${tab.value === 'active'}&page=${currentPage.value}`;

        if (searchName.value.trim()) {
            path += `&name=${encodeURIComponent(searchName.value.trim())}`;
        }

        warehouseProductsPage.value = await (new APICall<WarehouseProductsPage>(path)).execute();
    }

    async function fetchAddableProducts() {
        let path = `warehouse-products/from-approved-recipes-to-add?page=${currentPage.value}`;

        if (searchName.value.trim()) {
            path += `&name=${encodeURIComponent(searchName.value.trim())}`;
        }

        addableProductsPage.value = await (new APICall<WarehouseProductsAddableProductsPage>(path)).execute();
    }

    async function getNextPage() {
        currentPage.value++;
        resetPages();
        await fetchProducts();
    }

    async function getPreviousPage() {
        currentPage.value--;
        resetPages();
        await fetchProducts();
    }

    onMounted(async () => {
        await fetchProducts();
    });
</script>

<style lang="scss">
    .warehouse-products-view__toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        width: 100%;
        margin-bottom: 20px;
    }

    .warehouse-products-view__add-button {
        width: 75px;
        padding: 4px;
        flex-shrink: 0;
    }

    .warehouse-products-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .warehouse-products-view__tabs {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        width: 100%;
        border-bottom: 1px solid $lightGrayBorder;
        padding-top: 4px;
    }

    .warehouse-products-view__tab {
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

        &:hover:not(.warehouse-products-view__tab--active) {
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

    .warehouse-products-view__results {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 20px;
    }

    .warehouse-products-view__tab__wrapper {
        flex: 1;
        display: flex;
        padding: 15px 5px 5px;
        clip-path: inset(-10px 0px 1px 1px);

        @include glass-gray-shadow();
    }

    .warehouse-products-view__not-results {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;

        p {
            font-weight: bold;
        }
    }
</style>
