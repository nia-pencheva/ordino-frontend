<template>
    <TheLayout>
        <div class="orders-view__header">
            <TheTitle>Orders</TheTitle>

            <TheButton
                class="orders-view__create-button"
                @click="router.push({ name: 'create-order' })"
            >
                Create
            </TheButton>
        </div>

        <div class="orders-view__tabs">
            <div
                v-for="tab in TABS"
                :key="tab.id"
                @click="selectTab(tab.id)"
                :class="['orders-view__tab', { 'orders-view__tab--active': activeTab === tab.id }]"
            >
                {{ tab.label }}
            </div>
        </div>

        <div class="orders-view__tab-wrapper">
            <div class="orders-view__filters">
                <div v-if="activeTab === 'received'" class="orders-view__filter-group">
                    <label class="orders-view__filter-label">Filter by</label>
                    <TheSelect
                        v-model="timeField"
                        :options="TIME_FIELD_OPTIONS"
                    />
                </div>

                <div class="orders-view__filter-group">
                    <label class="orders-view__filter-label">From</label>
                    <input
                        v-model="fromInput"
                        type="datetime-local"
                        class="orders-view__datetime-input"
                        @change="onFilterChange"
                    />
                </div>

                <div class="orders-view__filter-group">
                    <label class="orders-view__filter-label">To</label>
                    <input
                        v-model="toInput"
                        type="datetime-local"
                        class="orders-view__datetime-input"
                        @change="onFilterChange"
                    />
                </div>

                <TheButton
                    v-if="fromInput || toInput"
                    class="orders-view__clear-button"
                    @click="clearFilters"
                >
                    Clear
                </TheButton>
            </div>

            <div v-if="!loaded" class="orders-view__loader">
                <TheSpinner size="lg" />
            </div>

            <template v-else>
                <div v-if="(ordersPage?.totalElements ?? 0) > 0" class="orders-view__results">
                    <OrdersTable :orders="ordersPage?.orders" />

                    <ThePager
                        v-if="(ordersPage?.totalElements ?? 0) > pageSize"
                        :current-page="currentPage"
                        :total-pages="ordersPage?.totalPages"
                        @previous="getPreviousPage"
                        @next="getNextPage"
                    />
                </div>

                <div v-else class="orders-view__no-results">
                    <p>No orders found</p>
                </div>
            </template>
        </div>
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref, watch } from 'vue'
    import { useRouter } from 'vue-router'

    import { APICall } from '@/service/api/api'
    import { OrdersPage } from '@/components/warehouse/orders/orders-models'

    import TheLayout from '@/components/layout/TheLayout.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'
    import TheButton from '@/components/base/TheButton.vue'
    import TheSelect, { type SelectOption } from '@/components/base/TheSelect.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'
    import ThePager from '@/components/base/ThePager.vue'
    import OrdersTable from '@/components/warehouse/orders/OrdersTable.vue'

    interface Tab {
        id: string
        label: string
        statusName: string
    }

    const TABS: Tab[] = [
        { id: 'pending',   label: 'Pending',   statusName: 'PENDING'   },
        { id: 'received',  label: 'Received',  statusName: 'RECEIVED'  },
        { id: 'cancelled', label: 'Cancelled', statusName: 'CANCELLED' },
    ]

    const TIME_FIELD_OPTIONS: SelectOption[] = [
        { value: 'createdAt',  label: 'Created at'  },
        { value: 'receivedAt', label: 'Received at' },
    ]

    const router = useRouter()

    const pageSize = 10

    const ordersPage = ref<OrdersPage | undefined>(undefined)
    const currentPage = ref<number>(1)
    const activeTab = ref<string>('pending')
    const timeField = ref<string | number | null>('createdAt')
    const fromInput = ref<string>('')
    const toInput = ref<string>('')

    const loaded = computed<boolean>(() => ordersPage.value != undefined)

    watch(timeField, () => {
        if (activeTab.value !== 'received') return
        currentPage.value = 1
        ordersPage.value = undefined
        fetchOrders()
    })

    async function fetchOrders() {
        const statusName = TABS.find(t => t.id === activeTab.value)?.statusName ?? 'PENDING'
        let path = `orders?page=${currentPage.value}&pageSize=${pageSize}&orderStatus=${statusName}`

        if (activeTab.value === 'received') path += `&timeField=${timeField.value}`
        if (fromInput.value) path += `&from=${new Date(fromInput.value).toISOString()}`
        if (toInput.value) path += `&to=${new Date(toInput.value).toISOString()}`

        ordersPage.value = await new APICall<OrdersPage>(path).execute()
    }

    function selectTab(tabId: string) {
        if (activeTab.value === tabId) return
        activeTab.value = tabId
        currentPage.value = 1
        ordersPage.value = undefined
        fetchOrders()
    }

    function onFilterChange() {
        currentPage.value = 1
        ordersPage.value = undefined
        fetchOrders()
    }

    function clearFilters() {
        fromInput.value = ''
        toInput.value = ''
        currentPage.value = 1
        ordersPage.value = undefined
        fetchOrders()
    }

    async function getNextPage() {
        currentPage.value++
        ordersPage.value = undefined
        await fetchOrders()
    }

    async function getPreviousPage() {
        currentPage.value--
        ordersPage.value = undefined
        await fetchOrders()
    }

    onMounted(async () => {
        await fetchOrders()
    })
</script>

<style lang="scss">
    .orders-view__header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .orders-view__create-button {
        width: 90px;
        padding: 4px;
        flex-shrink: 0;
    }

    .orders-view__tabs {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        width: 100%;
        border-bottom: 1px solid $lightGrayBorder;
        padding-top: 4px;
    }

    .orders-view__tab {
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

        &:hover:not(.orders-view__tab--active) {
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

    .orders-view__tab-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 15px 5px 5px;
        clip-path: inset(-10px 0px 1px 1px);
        gap: 15px;

        @include glass-gray-shadow();
    }

    .orders-view__filters {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        gap: 20px;
        flex-wrap: wrap;
    }

    .orders-view__filter-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .orders-view__datetime-input {
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

    .orders-view__clear-button {
        width: 75px;
        padding: 4px 8px;
    }

    .orders-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .orders-view__results {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 20px;
    }

    .orders-view__no-results {
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
