<template>
    <TheLayout>
        <div v-if="!loaded" class="product-stock-view__loader">
            <TheSpinner size="lg" />
        </div>

        <template v-else>
            <TheTitle>{{ productName }} stock</TheTitle>

            <div v-if="(batchesPage?.totalElements ?? 0) > 0" class="product-stock-view__results">
                <div class="product-stock-view__list">
                    <div
                        v-for="batch in batchesPage?.batches"
                        :key="batch.id"
                        class="product-stock-view__row"
                        @click="router.push({ name: 'stock-batch', params: { productId: route.params.productId, batchId: batch.id } })"
                    >
                        <span class="product-stock-view__row-id">#{{ batch.id }}</span>
                        <span class="product-stock-view__row-expiry">Expires: {{ batch.expiryDate ?? '—' }}</span>
                    </div>
                </div>

                <ThePager
                    v-if="(batchesPage?.totalElements ?? 0) > pageSize"
                    :current-page="currentPage"
                    :total-pages="batchesPage?.totalPages"
                    @previous="getPreviousPage"
                    @next="getNextPage"
                />
            </div>

            <div v-else class="product-stock-view__no-results">
                <p>No batches in stock</p>
            </div>
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    import { APICall } from '@/service/api/api'
    import { WarehouseProduct } from '@/components/warehouse/products/warehouse-products-models'

    import TheLayout from '@/components/layout/TheLayout.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'
    import ThePager from '@/components/base/ThePager.vue'

    interface Batch {
        id: number
        expiryDate: string | null
    }

    interface BatchesPage {
        batches: Batch[]
        totalElements: number
        totalPages: number
    }

    const route = useRoute()
    const router = useRouter()

    const pageSize = 10

    const productName = ref<string>('')
    const batchesPage = ref<BatchesPage | undefined>(undefined)
    const currentPage = ref<number>(1)

    const loaded = computed<boolean>(() => batchesPage.value != undefined && productName.value !== '')

    async function fetchBatches() {
        batchesPage.value = await new APICall<BatchesPage>(
            `warehouse-batches/${route.params.productId}?page=${currentPage.value}&pageSize=${pageSize}`
        ).execute()
    }

    async function getNextPage() {
        currentPage.value++
        batchesPage.value = undefined
        await fetchBatches()
    }

    async function getPreviousPage() {
        currentPage.value--
        batchesPage.value = undefined
        await fetchBatches()
    }

    onMounted(async () => {
        const [warehouseProduct] = await Promise.all([
            new APICall<WarehouseProduct>(`warehouse-products/${route.params.productId}`).execute(),
            fetchBatches()
        ])
        productName.value = warehouseProduct.productName
    })
</script>

<style lang="scss">
    .product-stock-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .product-stock-view__results {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 20px;
    }

    .product-stock-view__list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }

    .product-stock-view__row {
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

    .product-stock-view__row-expiry {
        color: #666;
    }

    .product-stock-view__no-results {
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
