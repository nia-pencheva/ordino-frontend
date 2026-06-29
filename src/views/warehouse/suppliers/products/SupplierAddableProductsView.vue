<template>
    <TheLayout :content-styles="['supplier-addable-products-view']">
        <div class="supplier-addable-products-view__wrapper">
            <TheTitle>Add product to catalog</TheTitle>

            <div class="supplier-addable-products-view__filters">
                <TheSearchbar
                    v-model="searchName"
                    placeholder="Search products..."
                />

                <TheSelect
                    v-model="warehouseProductCategoryId"
                    :options="categoryOptions"
                    placeholder="All categories"
                    class="supplier-addable-products-view__category-select"
                />
            </div>

            <div
                v-if="!loaded"
                class="supplier-addable-products-view__loader"
            >
                <TheSpinner size="lg" />
            </div>

            <template v-else>
                <div 
                    v-if="(productsPage?.totalElements ?? 0) > 0"
                    class="supplier-addable-produts-view__results"    
                >
                    <div class="supplier-addable-products-view__table">
                        <div
                            v-for="product in productsPage?.products"
                            :key="product.id"
                            class="supplier-addable-products-view__row"
                        >
                            <p>{{ product.name }}</p>
                            <TheButton
                                class="supplier-addable-products-view__add-button"
                                @click="router.push({ name: 'add-supplier-product', params: { id: route.params.supplierId }, query: { warehouseProductId: product.id, productName: product.name, unitAbbreviation: product.unitAbbreviation } })"
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
                </div>

                <div
                    v-else
                    class="supplier-addable-products-view__no-results"
                >
                    <p>No products found</p>
                </div>
            </template>
        </div>
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { APICall } from '@/service/api/api'

    import TheButton from '@/components/base/TheButton.vue'
    import TheLayout from '@/components/layout/TheLayout.vue'
    import ThePager from '@/components/base/ThePager.vue'
    import TheSearchbar from '@/components/base/TheSearchbar.vue'
    import TheSelect, { type SelectOption } from '@/components/base/TheSelect.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'

    import { AddableWarehouseProductsPage } from '@/components/warehouse/suppliers/suppliers-models'
    import type { WarehouseProductCategory } from '@/components/warehouse/product_categories/warehouse-product-categories-models'

    const route = useRoute()
    const router = useRouter()

    const pageSize = 10

    const searchName = ref<string>('')
    const warehouseProductCategoryId = ref<string | number | null>(null)
    const currentPage = ref<number>(1)
    const productsPage = ref<AddableWarehouseProductsPage | undefined>(undefined)
    const categoryOptions = ref<SelectOption[]>([])

    const loaded = computed<boolean>(() => productsPage.value !== undefined)

    let debounceTimer: ReturnType<typeof setTimeout>

    watch(searchName, () => {
        clearTimeout(debounceTimer)
        currentPage.value = 1
        productsPage.value = undefined
        debounceTimer = setTimeout(fetchProducts, 400)
    })

    watch(warehouseProductCategoryId, () => {
        currentPage.value = 1
        productsPage.value = undefined
        fetchProducts()
    })

    async function fetchProducts() {
        let path = `suppliers/${route.params.supplierId}/products/addable?page=${currentPage.value}&pageSize=${pageSize}`
        if (searchName.value.trim()) {
            path += `&name=${encodeURIComponent(searchName.value.trim())}`
        }
        if (warehouseProductCategoryId.value) {
            path += `&categoryId=${warehouseProductCategoryId.value}`
        }
        productsPage.value = await new APICall<AddableWarehouseProductsPage>(path).execute()
    }

    async function fetchCategories() {
        const categories = await new APICall<WarehouseProductCategory[]>('warehouse-product-categories').execute()
        categoryOptions.value = [
            { value: 0, label: 'All categories' },
            ...buildCategoryOptions(categories)
        ]
    }

    function buildCategoryOptions(categories: WarehouseProductCategory[]): SelectOption[] {
        return categories.map(c => ({
            value: c.id,
            label: c.category,
            children: c.subCategories?.length ? buildCategoryOptions(c.subCategories) : undefined
        }))
    }

    async function getNextPage() {
        currentPage.value++
        productsPage.value = undefined
        await fetchProducts()
    }

    async function getPreviousPage() {
        currentPage.value--
        productsPage.value = undefined
        await fetchProducts()
    }

    onMounted(async () => {
        await Promise.all([fetchProducts(), fetchCategories()])
    })
</script>

<style lang="scss">
    .supplier-addable-products-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .supplier-addable-products-view__wrapper {
        width: 100%;
        padding: 0px 10px;
    }

    .supplier-addable-products-view__filters {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .supplier-addable-products-view__category-select {
        width: 180px;
        flex-shrink: 0;
    }

    .supplier-addable-products-view__loader {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: $tableMinHeight;
        margin-top: 20px;
    }

    .supplier-addable-produts-view__results {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
    }

    .supplier-addable-products-view__table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
        margin-top: 20px;
    }

    .supplier-addable-products-view__row {
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

    .supplier-addable-products-view__add-button {
        width: 50px;
        padding: 4px;
        flex-shrink: 0;
    }

    .supplier-addable-products-view__no-results {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: $tableMinHeight;
        margin-top: 20px;

        p {
            font-weight: bold;
        }
    }
</style>
