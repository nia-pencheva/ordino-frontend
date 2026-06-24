<template>
    <TheLayout>
        <TheTitle>Stock log</TheTitle>

        <div class="stock-log-view__filters__wrapper">
            <div class="stock-log-view__filters">
                <div class="stock-log-view__filter-group">
                    <label class="stock-log-view__filter-label">Product</label>
                    <TheSelect
                        v-model="productId"
                        :options="productOptions"
                        placeholder="All products"
                        @update:model-value="onFilterChange"
                    />
                </div>

                <div class="stock-log-view__filter-group">
                    <label class="stock-log-view__filter-label">From</label>
                    <input
                        v-model="fromInput"
                        type="datetime-local"
                        class="stock-log-view__datetime-input"
                        @change="onFilterChange"
                    />
                </div>

                <div class="stock-log-view__filter-group">
                    <label class="stock-log-view__filter-label">To</label>
                    <input
                        v-model="toInput"
                        type="datetime-local"
                        class="stock-log-view__datetime-input"
                        @change="onFilterChange"
                    />
                </div>

                <TheButton
                    v-if="(productId !== null && productId !== 0) || fromInput || toInput"
                    class="stock-log-view__clear-button"
                    @click="clearFilters"
                >
                    Clear
                </TheButton>
            </div>

            <p v-if="filterError" class="stock-log-view__field-error">{{ filterError }}</p>
        </div>

        <div class="stock-log-view__results">
            <div v-if="loading" class="stock-log-view__loader">
                <TheSpinner size="lg" />
            </div>

            <template v-else>
                <div
                    v-if="!filterError && logPage?.totalElements"
                    class="stock-log-view__table__wrapper"
                >
                    <div class="stock-log-view__table">
                        <template v-for="group in groupedEntries" :key="group.key">
                            <div class="stock-log-view__day-header">{{ group.date }}</div>
                            <div
                                v-for="entry in group.entries"
                                :key="entry.id"
                                class="stock-log-view__row"
                                @click="router.push({ name: 'stock-log-info', params: { id: entry.id } })"
                            >
                                <div class="stock-log-view__row-left">
                                    <span :class="['stock-log-view__tag', `stock-log-view__tag--${entry.eventType.toLowerCase()}`]">
                                        {{ eventTypeLabel(entry.eventType) }}
                                    </span>
                                    <span class="stock-log-view__product-name">{{ entry.product.name }}</span>
                                </div>

                                <div class="stock-log-view__right">
                                    <span>{{ entry.user.fullName }}</span>
                                    <span class="stock-log-view__separator">|</span>
                                    <span class="stock-log-view__time">{{ formatTime(entry.createdAt) }}</span>
                                </div>
                            </div>
                        </template>
                    </div>

                    <ThePager
                        v-if="(logPage?.totalElements ?? 0) > pageSize"
                        class="stock-log-view__pager"
                        :current-page="page"
                        :total-pages="logPage?.totalPages"
                        @previous="onPrevious"
                        @next="onNext"
                    />
                </div>

                <div v-else class="stock-log-view__empty">
                    <p>No log entries found</p>
                </div>
            </template>
        </div>
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'

    import { APICall } from '@/service/api/api'
    import { UnprocessableContentError } from '@/service/api/models/response-errors'

    import TheLayout from '@/components/layout/TheLayout.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'
    import ThePager from '@/components/base/ThePager.vue'
    import TheButton from '@/components/base/TheButton.vue'
    import TheSelect, { type SelectOption } from '@/components/base/TheSelect.vue'

    interface CategoryProduct {
        id: number
        name: string
    }

    interface Category {
        id: number
        category: string
        subCategories: Category[]
        products: CategoryProduct[]
    }

    interface StockLogEntry {
        id: number
        product: { id: number; name: string }
        user: { id: number; fullName: string }
        eventType: string
        quantityDelta: number
        createdAt: string
        lossReason: string | null
        notes: string | null
    }

    interface StockLogPage {
        entries: StockLogEntry[]
        totalElements: number
        totalPages: number
    }

    const pageSize = 10

    const router = useRouter()

    const logPage = ref<StockLogPage | undefined>(undefined)
    const productOptions = ref<SelectOption[]>([])
    const loading = ref(false)
    const page = ref(1)
    const productId = ref<string | number | null>(null)
    const fromInput = ref('')
    const toInput = ref('')
    const filterError = ref<string | null>(null)

    const groupedEntries = computed(() => {
        const groups: { key: string; date: string; entries: StockLogEntry[] }[] = []
        const seen = new Map<string, StockLogEntry[]>()

        for (const entry of logPage.value?.entries ?? []) {
            const d = new Date(entry.createdAt)
            const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
            if (!seen.has(key)) {
                const bucket: StockLogEntry[] = []
                seen.set(key, bucket)
                groups.push({ key, date: formatDay(d), entries: bucket })
            }
            seen.get(key)!.push(entry)
        }

        return groups
    })

    function buildCategoryOption(cat: Category): SelectOption {
        const children: SelectOption[] = [
            ...cat.subCategories.map(buildCategoryOption),
            ...cat.products.map(p => ({ value: p.id, label: p.name }))
        ]
        if (!children.length) return { value: `cat_${cat.id}`, label: cat.category, disabled: true }
        return { value: `cat_${cat.id}`, label: cat.category, children }
    }

    async function fetchCategories() {
        const categories = await new APICall<Category[]>('warehouse-product-categories').execute()
        productOptions.value = [
            { value: 0, label: 'All products' },
            ...categories.map(buildCategoryOption)
        ]
    }

    async function fetchLog() {
        loading.value = true
        filterError.value = null

        try {
            const params = new URLSearchParams()
            params.set('page', String(page.value))
            params.set('pageSize', String(pageSize))
            if (typeof productId.value === 'string' && productId.value.startsWith('cat_')) {
                params.set('warehouseProductCategoryId', productId.value.slice(4))
            } else if (typeof productId.value === 'number' && productId.value > 0) {
                params.set('warehouseProductId', String(productId.value))
            }
            if (fromInput.value) params.set('from', new Date(fromInput.value).toISOString())
            if (toInput.value) params.set('to', new Date(toInput.value).toISOString())

            logPage.value = await new APICall<StockLogPage>(`warehouse-batches/log?${params}`).execute()
        } catch (e) {
            if (e instanceof UnprocessableContentError) {
                filterError.value = e.getByField('from')[0]?.message ?? null
            }
        } finally {
            loading.value = false
        }
    }

    function onFilterChange() {
        page.value = 1
        fetchLog()
    }

    function clearFilters() {
        productId.value = null
        fromInput.value = ''
        toInput.value = ''
        filterError.value = null
        page.value = 1
        fetchLog()
    }

    function onPrevious() {
        page.value--
        fetchLog()
    }

    function onNext() {
        page.value++
        fetchLog()
    }

    function eventTypeLabel(eventType: string): string {
        const map: Record<string, string> = {
            RECEIVED: 'Received',
            USED: 'Used',
            LOST: 'Lost',
        }
        return map[eventType] ?? eventType
    }

    function formatDay(date: Date): string {
        return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(date)
    }

    function formatTime(createdAt: string): string {
        return new Date(createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    }

    onMounted(() => {
        fetchCategories()
        fetchLog()
    })
</script>

<style lang="scss">
    .stock-log-view__filters__wrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 15px;
    }

    .stock-log-view__filters {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        gap: 20px;
        flex-wrap: wrap;
    }

    .stock-log-view__filter-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .stock-log-view__datetime-input {
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

    .stock-log-view__clear-button {
        width: 75px;
        padding: 4px 8px;
    }

    .stock-log-view__field-error {
        color: $fontColorError;
        font-size: 12px;
        margin: 0;
    }

    .stock-log-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .stock-log-view__results {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 20px;
    }

    .stock-log-view__table__wrapper {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
    }

    .stock-log-view__table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }

    .stock-log-view__day-header {
        padding: 14px 0 0;
    }

    .stock-log-view__row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 14px;
        height: $tableRowHeight;
        background-color: white;
        border: 1px solid $midGray;
        border-radius: 5px;
        cursor: pointer;
        user-select: none;

        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1.00),
            inset 0 -1px 0 rgba(255, 255, 255, 0.40),
            inset 1px 0 0 rgba(255, 255, 255, 0.55),
            inset -1px 0 0 rgba(255, 255, 255, 0.55),
            0 1px 2px rgba(0, 0, 0, 0.20),
            0 1px 0 rgba(255, 255, 255, 0.60);
    }

    .stock-log-view__row-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        min-width: 0;
    }

    .stock-log-view__tag {
        padding: 4px 10px;
        border-radius: 3px;
        font-size: 13px;
        width: 72px;
        text-align: center;
        flex-shrink: 0;

        &--received { background: #d4edda; color: #256236; border: 1px solid #256236; }
        &--used     { background: #e8e8e8; color: #555;    border: 1px solid #aaa;    }
        &--lost     { background: #f5c6cb; color: #721c24; border: 1px solid #721c24; }
    }

    .stock-log-view__product-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .stock-log-view__right {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        flex-shrink: 0;
        margin-left: 12px;
    }

    .stock-log-view__separator {
        font-size: 16px;
        color: #888;
    }

    .stock-log-view__time {
        font-size: 13px;
        flex-shrink: 0;
    }

    .stock-log-view__empty {
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
