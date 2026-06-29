<template>
    <TheLayout>
        <div v-if="supplier == undefined" class="supplier-info-view__loader">
            <TheSpinner size="lg" />
        </div>

        <template v-else>
            <TheTitle>Supplier - {{ supplier.name }}</TheTitle>

            <div class="supplier-info-view__actions-toolbar">
                <TheButton
                    class="supplier-info-view__action-button"
                    @click="router.push({ name: 'edit-supplier', params: { id: route.params.id } })"
                >
                    Edit
                </TheButton>

                <TheButton
                    v-if="supplier.active"
                    class="supplier-info-view__action-button"
                    @click="deactivatePopupOpen = true"
                >
                    Deactivate
                </TheButton>

                <TheButton
                    v-else
                    class="supplier-info-view__action-button"
                    @click="activateSupplier"
                >
                    Activate
                </TheButton>

                <TheButton
                    class="supplier-info-view__action-button"
                    type="important"
                    :disabled="supplier.deleteForbiddenReasons.length > 0"
                    :tooltip="supplier.deleteForbiddenReasons"
                    @click="deletePopupOpen = true"
                >
                    Delete
                </TheButton>
            </div>

            <div>
                <SectionTitle>Information</SectionTitle>

                <div class="supplier-info-view__meta-row">
                    <span class="supplier-info-view__label">Address</span>
                    <span>{{ supplier.address }}</span>
                </div>

                <div class="supplier-info-view__meta-row">
                    <span class="supplier-info-view__label">Email</span>
                    <span>{{ supplier.email }}</span>
                </div>

                <div class="supplier-info-view__meta-row">
                    <span class="supplier-info-view__label">Phone number</span>
                    <span>{{ supplier.phoneNumber }}</span>
                </div>
            </div>

            <div class="supplier-info-view__tabs">
                <div
                    @click="tab = 'products'"
                    :class="['supplier-info-view__tab', { 'supplier-info-view__tab--active': tab === 'products' }]"
                >
                    Products
                </div>
                <div
                    @click="tab = 'orders'"
                    :class="['supplier-info-view__tab', { 'supplier-info-view__tab--active': tab === 'orders' }]"
                >
                    Orders
                </div>
            </div>

            <div class="supplier-info-view__tab__wrapper">
                <!-- Products tab -->
                <template v-if="tab === 'products'">
                    <div class="supplier-info-view__products-toolbar">
                        <TheSearchbar
                            v-model="productSearch"
                            placeholder="Search by name..."
                        />

                        <TheSelect
                            v-model="warehouseProductCategoryId"
                            :options="categoryOptions"
                            placeholder="All categories"
                            class="supplier-info-view__category-select"
                        />

                        <TheButton
                            class="supplier-info-view__add-button"
                            @click="router.push({ name: 'supplier-addable-products', params: { supplierId: route.params.id } })"
                        >
                            Add
                        </TheButton>
                    </div>

                    <div v-if="!productsLoaded" class="supplier-info-view__content-loader">
                        <TheSpinner size="lg" />
                    </div>

                    <template v-else>
                        <div v-if="productsPage?.totalElements != 0" class="supplier-info-view__results">
                            <SupplierProductsTable :products="productsPage?.products" :supplier-id="route.params.id as string" />

                            <ThePager
                                v-if="(productsPage?.totalElements ?? 0) > pageSize"
                                :current-page="productsCurrentPage"
                                :total-pages="productsPage?.totalPages"
                                @previous="getPreviousProductsPage"
                                @next="getNextProductsPage"
                            />
                        </div>

                        <div v-else class="supplier-info-view__no-results">
                            <p>No products found</p>
                        </div>
                    </template>
                </template>

                <!-- Orders tab -->
                <template v-if="tab === 'orders'">
                    <div class="supplier-info-view__order-subtabs">
                        <div
                            v-for="subtab in ORDER_SUBTABS"
                            :key="subtab.id"
                            @click="selectOrderSubtab(subtab.id)"
                            :class="['supplier-info-view__order-subtab', { 'supplier-info-view__order-subtab--active': activeOrderSubtab === subtab.id }]"
                        >
                            {{ subtab.label }}
                        </div>
                    </div>

                    <div class="supplier-info-view__orders-filters__wrapper">
                        <div class="supplier-info-view__orders-filters">
                            <div v-if="activeOrderSubtab === 'received'" class="supplier-info-view__filter-group">
                                <label class="supplier-info-view__filter-label">Filter by</label>
                                <TheSelect
                                    v-model="timeField"
                                    :options="TIME_FIELD_OPTIONS"
                                />
                            </div>

                            <div class="supplier-info-view__filter-group">
                                <label class="supplier-info-view__filter-label">From</label>
                                <input
                                    v-model="fromInput"
                                    type="datetime-local"
                                    class="supplier-info-view__datetime-input"
                                    @change="onOrderFilterChange"
                                />
                            </div>

                            <div class="supplier-info-view__filter-group">
                                <label class="supplier-info-view__filter-label">To</label>
                                <input
                                    v-model="toInput"
                                    type="datetime-local"
                                    class="supplier-info-view__datetime-input"
                                    @change="onOrderFilterChange"
                                />
                            </div>

                            <TheButton
                                v-if="fromInput || toInput"
                                class="supplier-info-view__clear-button"
                                @click="clearOrderFilters"
                            >
                                Clear
                            </TheButton>
                        </div>

                        <p v-if="orderFilterError" class="supplier-info-view__filter-error">{{ orderFilterError }}</p>
                    </div>

                    <div v-if="!ordersLoaded" class="supplier-info-view__content-loader">
                        <TheSpinner size="lg" />
                    </div>

                    <template v-else>
                        <div v-if="ordersPage?.totalElements != 0" class="supplier-info-view__results">
                            <div class="supplier-info-view__orders-list">
                                <div
                                    v-for="order in ordersPage?.orders"
                                    :key="order.id"
                                    class="supplier-info-view__order-row"
                                    @click="router.push({ name: 'order-info', params: { id: order.id } })"
                                >
                                    <span class="supplier-info-view__order-id">#{{ order.id }}</span>
                                    <span class="supplier-info-view__order-date">{{ formatDate(order.createdAt) }}</span>
                                </div>
                            </div>

                            <ThePager
                                v-if="(ordersPage?.totalElements ?? 0) > pageSize"
                                :current-page="ordersCurrentPage"
                                :total-pages="ordersPage?.totalPages"
                                @previous="getPreviousOrdersPage"
                                @next="getNextOrdersPage"
                            />
                        </div>

                        <div v-else class="supplier-info-view__no-results">
                            <p>No orders found</p>
                        </div>
                    </template>
                </template>
            </div>
        <DeactivateSupplierPopup
            v-if="deactivatePopupOpen"
            :supplier="supplier"
            @close="deactivatePopupOpen = false"
            @deactivated-supplier="handleDeactivated"
        />

        <DeleteSupplierPopup
            v-if="deletePopupOpen"
            :supplier="supplier"
            @close="deletePopupOpen = false"
            @deleted-supplier="handleDeleted"
        />
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    import { APICall } from '@/service/api/api'
    import { Supplier, SupplierProductsPage, SupplierOrdersPage } from '@/components/warehouse/suppliers/suppliers-models'
    import type { WarehouseProductCategory } from '@/components/warehouse/product_categories/warehouse-product-categories-models'

    import TheLayout from '@/components/layout/TheLayout.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'
    import SectionTitle from '@/components/base/SectionTitle.vue'
    import TheSearchbar from '@/components/base/TheSearchbar.vue'
    import TheSelect, { type SelectOption } from '@/components/base/TheSelect.vue'
    import TheButton from '@/components/base/TheButton.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'
    import ThePager from '@/components/base/ThePager.vue'
    import SupplierProductsTable from '@/components/warehouse/suppliers/SupplierProductsTable.vue'
    import DeactivateSupplierPopup from '@/components/warehouse/suppliers/DeactivateSupplierPopup.vue'
    import DeleteSupplierPopup from '@/components/warehouse/suppliers/DeleteSupplierPopup.vue'

    interface OrderSubtab {
        id: string
        label: string
        statusName: string
    }

    const ORDER_SUBTABS: OrderSubtab[] = [
        { id: 'pending',   label: 'Pending',   statusName: 'PENDING'   },
        { id: 'received',  label: 'Received',  statusName: 'RECEIVED'  },
        { id: 'cancelled', label: 'Cancelled', statusName: 'CANCELLED' },
    ]

    const TIME_FIELD_OPTIONS: SelectOption[] = [
        { value: 'createdAt',   label: 'Created at'  },
        { value: 'receivedAt',  label: 'Received at' },
    ]

    const route = useRoute()
    const router = useRouter()

    type Tab = 'products' | 'orders'

    const pageSize = 10

    const supplier = ref<Supplier | undefined>(undefined)
    const tab = ref<Tab>('products')
    const deactivatePopupOpen = ref<boolean>(false)
    const deletePopupOpen = ref<boolean>(false)

    const productsPage = ref<SupplierProductsPage | undefined>(undefined)
    const productSearch = ref<string>('')
    const warehouseProductCategoryId = ref<string | number | null>(null)
    const productsCurrentPage = ref<number>(1)
    const categoryOptions = ref<SelectOption[]>([])

    const ordersPage = ref<SupplierOrdersPage | undefined>(undefined)
    const ordersCurrentPage = ref<number>(1)
    const activeOrderSubtab = ref<string>('pending')
    const timeField = ref<string | number | null>('createdAt')
    const fromInput = ref<string>('')
    const toInput = ref<string>('')
    const orderFilterError = ref<string | null>(null)

    const productsLoaded = computed<boolean>(() => productsPage.value != undefined)
    const ordersLoaded = computed<boolean>(() => ordersPage.value != undefined)

    let debounceTimer: ReturnType<typeof setTimeout>

    watch(productSearch, () => {
        clearTimeout(debounceTimer)
        productsCurrentPage.value = 1
        productsPage.value = undefined
        debounceTimer = setTimeout(fetchProducts, 400)
    })

    watch(warehouseProductCategoryId, () => {
        productsCurrentPage.value = 1
        productsPage.value = undefined
        fetchProducts()
    })

    watch(tab, () => {
        if (tab.value === 'products' && productsPage.value == undefined) fetchProducts()
        if (tab.value === 'orders' && ordersPage.value == undefined) fetchOrders()
    })

    watch(timeField, () => {
        if (activeOrderSubtab.value !== 'received') return
        ordersCurrentPage.value = 1
        ordersPage.value = undefined
        fetchOrders()
    })

    async function fetchSupplier() {
        supplier.value = await new APICall<Supplier>(`suppliers/${route.params.id}`).execute()
    }

    async function activateSupplier() {
        await new APICall(`suppliers/${route.params.id}/activate`, 'POST').execute()
        await fetchSupplier()
    }

    async function handleDeactivated() {
        deactivatePopupOpen.value = false
        await fetchSupplier()
    }

    async function handleDeleted() {
        router.replace({ name: 'suppliers' })
    }

    async function fetchProducts() {
        let path = `suppliers/${route.params.id}/products?page=${productsCurrentPage.value}&pageSize=${pageSize}`

        if (productSearch.value.trim()) {
            path += `&name=${encodeURIComponent(productSearch.value.trim())}`
        }

        if (warehouseProductCategoryId.value) {
            path += `&warehouseProductCategoryId=${warehouseProductCategoryId.value}`
        }

        productsPage.value = await new APICall<SupplierProductsPage>(path).execute()
    }

    async function fetchOrders() {
        orderFilterError.value = null

        const statusName = ORDER_SUBTABS.find(s => s.id === activeOrderSubtab.value)?.statusName ?? 'PENDING'
        let path = `suppliers/${route.params.id}/orders?page=${ordersCurrentPage.value}&pageSize=${pageSize}&orderStatus=${statusName}`

        if (activeOrderSubtab.value === 'received') path += `&timeField=${timeField.value}`
        if (fromInput.value) path += `&from=${new Date(fromInput.value).toISOString()}`
        if (toInput.value) path += `&to=${new Date(toInput.value).toISOString()}`

        ordersPage.value = await new APICall<SupplierOrdersPage>(path).execute()
    }

    function selectOrderSubtab(subtabId: string) {
        if (activeOrderSubtab.value === subtabId) return
        activeOrderSubtab.value = subtabId
        ordersCurrentPage.value = 1
        ordersPage.value = undefined
        fetchOrders()
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

    function onOrderFilterChange() {
        ordersCurrentPage.value = 1
        ordersPage.value = undefined
        fetchOrders()
    }

    function clearOrderFilters() {
        fromInput.value = ''
        toInput.value = ''
        orderFilterError.value = null
        ordersCurrentPage.value = 1
        ordersPage.value = undefined
        fetchOrders()
    }

    async function getNextProductsPage() {
        productsCurrentPage.value++
        productsPage.value = undefined
        await fetchProducts()
    }

    async function getPreviousProductsPage() {
        productsCurrentPage.value--
        productsPage.value = undefined
        await fetchProducts()
    }

    async function getNextOrdersPage() {
        ordersCurrentPage.value++
        ordersPage.value = undefined
        await fetchOrders()
    }

    async function getPreviousOrdersPage() {
        ordersCurrentPage.value--
        ordersPage.value = undefined
        await fetchOrders()
    }

    function formatDate(isoString: string): string {
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(isoString))
    }

    onMounted(async () => {
        await fetchSupplier()
        await Promise.all([fetchProducts(), fetchCategories()])
    })
</script>

<style lang="scss">
    .supplier-info-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .supplier-info-view__actions-toolbar {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }

    .supplier-info-view__action-button {
        width: 90px;
        padding: 4px;
    }

    .supplier-info-view__meta-row {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .supplier-info-view__label {
        font-weight: bold;
        width: 100%;
        flex-shrink: 0;
        color: black;
    }

    .supplier-info-view__tabs {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        width: 100%;
        border-bottom: 1px solid $lightGrayBorder;
        padding-top: 4px;
    }

    .supplier-info-view__tab {
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

        &:hover:not(.supplier-info-view__tab--active) {
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

    .supplier-info-view__tab__wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 15px 5px 5px;
        clip-path: inset(-10px 0px 1px 1px);
        gap: 15px;

        @include glass-gray-shadow();
    }

    .supplier-info-view__products-toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .supplier-info-view__category-select {
        width: 180px;
        flex-shrink: 0;
    }

    .supplier-info-view__add-button {
        width: 75px;
        padding: 4px;
        flex-shrink: 0;
    }

    .supplier-info-view__content-loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: $tableMinHeight;
    }

    .supplier-info-view__results {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 20px;
    }

    .supplier-info-view__no-results {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: $tableMinHeight;

        p {
            font-weight: bold;
        }
    }

    .supplier-info-view__order-subtabs {
        display: flex;
        flex-direction: row;
        gap: 6px;
        overflow-x: auto;
        flex-shrink: 0;
        padding-bottom: 4px;
        scrollbar-width: thin;
        scrollbar-color: $midGray transparent;

        &::-webkit-scrollbar {
            height: 3px;
        }

        &::-webkit-scrollbar-thumb {
            background: $midGray;
            border-radius: 2px;
        }
    }

    .supplier-info-view__order-subtab {
        padding: 5px 14px;
        border-radius: 3px;
        border: 1px solid $lightGrayBorder;
        background: $darkGray;
        color: #888;
        font-size: 13px;
        cursor: pointer;
        white-space: nowrap;
        user-select: none;

        &:hover:not(.supplier-info-view__order-subtab--active) {
            background: darken($darkGray, 4%);
        }

        &--active {
            background: white;
            color: $fontColorMain;
            border-color: #9d9d9d;

            @include glass-gray-shadow();
        }
    }

    .supplier-info-view__orders-filters__wrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .supplier-info-view__orders-filters {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        gap: 20px;
        flex-wrap: wrap;
    }

    .supplier-info-view__filter-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .supplier-info-view__datetime-input {
        height: 30px;
        border-radius: 3px;
        padding: 3px 8px;
        border: 1px solid rgba(100, 130, 170, 0.55);
        background-color: #fff;
        color: #1a1a1a;
        outline: none;
        font-size: 14px;

        box-shadow:
            inset 0 1px 3px rgba(0, 0, 0, 0.20),
            inset 0 1px 1px rgba(0, 0, 0, 0.12),
            0 1px 0 rgba(255, 255, 255, 0.80);

        &:focus {
            border-color: rgba(60, 120, 210, 0.90);
            box-shadow:
                inset 0 1px 3px rgba(0, 0, 0, 0.18),
                0 0 0 2px rgba(80, 150, 230, 0.28);
        }
    }

    .supplier-info-view__clear-button {
        width: 75px;
        padding: 4px 8px;
    }

    .supplier-info-view__filter-error {
        color: $fontColorError;
        font-size: 12px;
        margin: 0;
    }

    .supplier-info-view__orders-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }

    .supplier-info-view__order-row {
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
    }

    .supplier-info-view__order-date {
        color: rgba(0, 0, 0, 0.55);
        font-size: 13px;
    }
</style>
