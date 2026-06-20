<template>
    <TheLayout>
        <div v-if="supplierProduct == undefined" class="supplier-product-info-view__loader">
            <TheSpinner size="lg" />
        </div>

        <template v-else>
            <TheTitle>{{ supplierProduct.productName }}</TheTitle>

            <div class="supplier-product-info-view__actions-toolbar">
                <TheButton
                    class="supplier-product-info-view__action-button"
                    @click="router.push({ name: 'edit-supplier-product-info', params: { supplierId: route.params.supplierId, supplierProductId: route.params.supplierProductId } })"
                >
                    Edit
                </TheButton>

                <TheButton
                    class="supplier-product-info-view__action-button"
                    type="important"
                    @click="deletePopupOpen = true"
                >
                    Delete
                </TheButton>
            </div>

            <div>
                <SectionTitle>Information</SectionTitle>

                <div class="supplier-product-info-view__meta-row">
                    <span class="supplier-product-info-view__label">Price</span>
                    <span>{{ supplierProduct.price }}</span>
                </div>

                <div class="supplier-product-info-view__meta-row">
                    <span class="supplier-product-info-view__label">Minimum order quantity</span>
                    <span>{{ supplierProduct.minOrderQuantity }}</span>
                </div>
            </div>

            <div>
                <SectionTitle>Orders</SectionTitle>

                <div class="supplier-product-info-view__order-tabs">
                    <div
                        v-for="subtab in ORDER_SUBTABS"
                        :key="subtab.id"
                        @click="selectSubtab(subtab.id)"
                        :class="['supplier-product-info-view__order-tab', { 'supplier-product-info-view__order-tab--active': activeSubtab === subtab.id }]"
                    >
                        {{ subtab.label }}
                    </div>
                </div>

                <div class="supplier-product-info-view__order-tab-wrapper">
                    <div class="supplier-product-info-view__orders-filters__wrapper">
                        <div class="supplier-product-info-view__orders-filters">
                            <div v-if="activeSubtab === 'received'" class="supplier-product-info-view__filter-group">
                                <label class="supplier-product-info-view__filter-label">Filter by</label>
                                <TheSelect
                                    v-model="timeField"
                                    :options="TIME_FIELD_OPTIONS"
                                />
                            </div>

                            <div class="supplier-product-info-view__filter-group">
                                <label class="supplier-product-info-view__filter-label">From</label>
                                <input
                                    v-model="fromInput"
                                    type="datetime-local"
                                    class="supplier-product-info-view__datetime-input"
                                    @change="onOrderFilterChange"
                                />
                            </div>

                            <div class="supplier-product-info-view__filter-group">
                                <label class="supplier-product-info-view__filter-label">To</label>
                                <input
                                    v-model="toInput"
                                    type="datetime-local"
                                    class="supplier-product-info-view__datetime-input"
                                    @change="onOrderFilterChange"
                                />
                            </div>

                            <TheButton
                                v-if="fromInput || toInput"
                                class="supplier-product-info-view__clear-button"
                                @click="clearOrderFilters"
                            >
                                Clear
                            </TheButton>
                        </div>
                    </div>

                    <div v-if="!ordersLoaded" class="supplier-product-info-view__content-loader">
                        <TheSpinner size="lg" />
                    </div>

                    <template v-else>
                        <div v-if="(ordersPage?.totalElements ?? 0) > 0" class="supplier-product-info-view__orders">
                            <div class="supplier-product-info-view__orders-list">
                                <div
                                    v-for="order in ordersPage?.orders"
                                    :key="order.id"
                                    class="supplier-product-info-view__order-row"
                                    @click="router.push({ name: 'order-info', params: { id: order.id } })"
                                >
                                    <span class="supplier-product-info-view__order-id">#{{ order.id }}</span>
                                    <span class="supplier-product-info-view__order-date">{{ formatDate(order.createdAt) }}</span>
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

                        <div v-else class="supplier-product-info-view__no-orders">
                            <p>No orders found</p>
                        </div>
                    </template>
                </div>
            </div>

            <DeleteSupplierProductPopup
                v-if="deletePopupOpen"
                :supplier-product="supplierProduct"
                :supplier-id="route.params.supplierId as string"
                @close="deletePopupOpen = false"
                @deleted="handleDeleted"
            />
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    import { APICall } from '@/service/api/api'
    import { SupplierProduct, SupplierOrdersPage } from '@/components/warehouse/suppliers/suppliers-models'

    import TheLayout from '@/components/layout/TheLayout.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'
    import SectionTitle from '@/components/base/SectionTitle.vue'
    import TheButton from '@/components/base/TheButton.vue'
    import TheSelect, { type SelectOption } from '@/components/base/TheSelect.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'
    import ThePager from '@/components/base/ThePager.vue'
    import DeleteSupplierProductPopup from '@/components/warehouse/suppliers/DeleteSupplierProductPopup.vue'

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
        { value: 'createdAt',  label: 'Created at'  },
        { value: 'receivedAt', label: 'Received at' },
    ]

    const route = useRoute()
    const router = useRouter()

    const pageSize = 10

    const supplierProduct = ref<SupplierProduct | undefined>(undefined)
    const deletePopupOpen = ref<boolean>(false)

    const ordersPage = ref<SupplierOrdersPage | undefined>(undefined)
    const ordersCurrentPage = ref<number>(1)
    const activeSubtab = ref<string>('pending')
    const timeField = ref<string | number | null>('createdAt')
    const fromInput = ref<string>('')
    const toInput = ref<string>('')

    const ordersLoaded = computed<boolean>(() => ordersPage.value != undefined)

    watch(timeField, () => {
        if (activeSubtab.value !== 'received') return
        ordersCurrentPage.value = 1
        ordersPage.value = undefined
        fetchOrders()
    })

    async function fetchSupplierProduct() {
        supplierProduct.value = await new APICall<SupplierProduct>(
            `suppliers/${route.params.supplierId}/products/${route.params.supplierProductId}`
        ).execute()
    }

    async function fetchOrders() {
        const statusName = ORDER_SUBTABS.find(s => s.id === activeSubtab.value)?.statusName ?? 'PENDING'
        let path = `suppliers/${route.params.supplierId}/products/${route.params.supplierProductId}/orders?page=${ordersCurrentPage.value}&pageSize=${pageSize}&orderStatus=${statusName}`

        if (activeSubtab.value === 'received') path += `&timeField=${timeField.value}`
        if (fromInput.value) path += `&from=${new Date(fromInput.value).toISOString()}`
        if (toInput.value) path += `&to=${new Date(toInput.value).toISOString()}`

        ordersPage.value = await new APICall<SupplierOrdersPage>(path).execute()
    }

    function selectSubtab(subtabId: string) {
        if (activeSubtab.value === subtabId) return
        activeSubtab.value = subtabId
        ordersCurrentPage.value = 1
        ordersPage.value = undefined
        fetchOrders()
    }

    function onOrderFilterChange() {
        ordersCurrentPage.value = 1
        ordersPage.value = undefined
        fetchOrders()
    }

    function clearOrderFilters() {
        fromInput.value = ''
        toInput.value = ''
        ordersCurrentPage.value = 1
        ordersPage.value = undefined
        fetchOrders()
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

    function handleDeleted() {
        router.replace({ name: 'supplier-info', params: { id: route.params.supplierId } })
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
        await fetchSupplierProduct()
        await fetchOrders()
    })
</script>

<style lang="scss">
    .supplier-product-info-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .supplier-product-info-view__actions-toolbar {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }

    .supplier-product-info-view__action-button {
        width: 90px;
        padding: 4px;
    }

    .supplier-product-info-view__meta-row {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .supplier-product-info-view__label {
        font-weight: bold;
        width: 100%;
        flex-shrink: 0;
        color: black;
    }

    .supplier-product-info-view__order-tabs {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        width: 100%;
        border-bottom: 1px solid $lightGrayBorder;
        padding-top: 4px;
    }

    .supplier-product-info-view__order-tab {
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

        &:hover:not(.supplier-product-info-view__order-tab--active) {
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

    .supplier-product-info-view__order-tab-wrapper {
        display: flex;
        flex-direction: column;
        padding: 15px 5px 5px;
        clip-path: inset(-10px 0px 1px 1px);
        gap: 15px;

        @include glass-gray-shadow();
    }

    .supplier-product-info-view__orders-filters__wrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .supplier-product-info-view__orders-filters {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        gap: 20px;
        flex-wrap: wrap;
    }

    .supplier-product-info-view__filter-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .supplier-product-info-view__datetime-input {
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

    .supplier-product-info-view__clear-button {
        width: 75px;
        padding: 4px 8px;
    }

    .supplier-product-info-view__content-loader {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: $tableMinHeight;
    }

    .supplier-product-info-view__orders {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 20px;
    }

    .supplier-product-info-view__orders-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }

    .supplier-product-info-view__order-row {
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

    .supplier-product-info-view__order-id {
        font-weight: 600;
    }

    .supplier-product-info-view__order-date {
        color: rgba(0, 0, 0, 0.55);
        font-size: 13px;
    }

    .supplier-product-info-view__no-orders {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: $tableMinHeight;

        p {
            font-weight: bold;
        }
    }
</style>
