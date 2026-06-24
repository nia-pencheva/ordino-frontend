<template>
    <TheLayout>
        <div class="stock-view__header">
            <TheTitle>Stock</TheTitle>

            <TheButton
                class="stock-view__log-button"
                @click="router.push({ name: 'stock-log' })"
            >
                Log
            </TheButton>
        </div>

        <div v-if="!loaded" class="stock-view__loader">
            <TheSpinner size="lg" />
        </div>

        <template v-else>
            <div v-if="(stockPage?.totalElements ?? 0) > 0" class="stock-view__results">
                <div class="stock-view__list">
                    <div
                        v-for="product in stockPage?.products"
                        :key="product.warehouseProductId"
                        class="stock-view__row"
                        @click="router.push({ name: 'product-stock', params: { productId: product.warehouseProductId } })"
                    >
                        <span>{{ product.productName }}</span>
                    </div>
                </div>

                <ThePager
                    v-if="(stockPage?.totalElements ?? 0) > pageSize"
                    :current-page="currentPage"
                    :total-pages="stockPage?.totalPages"
                    @previous="getPreviousPage"
                    @next="getNextPage"
                />
            </div>

            <div v-else class="stock-view__no-results">
                <p>No products in stock</p>
            </div>
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'

    import { APICall } from '@/service/api/api'

    import TheLayout from '@/components/layout/TheLayout.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'
    import TheButton from '@/components/base/TheButton.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'
    import ThePager from '@/components/base/ThePager.vue'

    interface StockProduct {
        warehouseProductId: number
        productName: string
    }

    interface StockPage {
        products: StockProduct[]
        totalElements: number
        totalPages: number
    }

    const router = useRouter()

    const pageSize = 10

    const stockPage = ref<StockPage | undefined>(undefined)
    const currentPage = ref<number>(1)

    const loaded = computed<boolean>(() => stockPage.value != undefined)

    async function fetchStock() {
        stockPage.value = await new APICall<StockPage>(`warehouse-batches?page=${currentPage.value}&pageSize=${pageSize}`).execute()
    }

    async function getNextPage() {
        currentPage.value++
        stockPage.value = undefined
        await fetchStock()
    }

    async function getPreviousPage() {
        currentPage.value--
        stockPage.value = undefined
        await fetchStock()
    }

    onMounted(async () => {
        await fetchStock()
    })
</script>

<style lang="scss">
    .stock-view__header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .stock-view__log-button {
        width: 75px;
        padding: 4px;
        flex-shrink: 0;
    }

    .stock-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .stock-view__results {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 20px;
    }

    .stock-view__list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }

    .stock-view__row {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: $tableRowHeight;
        padding: 10px;
        background-color: white;
        border: 1px solid $midGray;
        border-radius: 5px;

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

    .stock-view__no-results {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;

        p {
            font-weight: bold;
        }
    }
</style>
