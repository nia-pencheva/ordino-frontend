<template>
    <TheLayout>
        <div v-if="loading" class="stock-log-info__loader">
            <TheSpinner size="lg" />
        </div>

        <template v-else-if="entry">
            <TheTitle>Warehouse batch event #{{ entry.id }}</TheTitle>

            <div class="stock-log-info__header-meta">
                <span class="stock-log-info__header-time">{{ formatDateTime(entry.createdAt) }}</span>
                <TheLink @click="router.push({ name: 'user-info', params: { id: entry.user.id } })">
                    {{ entry.user.fullName }}
                </TheLink>
            </div>

            <SectionTitle>Information</SectionTitle>

            <div class="stock-log-info__meta-row">
                <span class="stock-log-info__label">Product</span>
                <TheLink @click="router.push({ name: 'warehouse-product-info', params: { id: entry.product.id } })">
                    {{ entry.product.name }}
                </TheLink>
            </div>

            <div class="stock-log-info__meta-row">
                <span class="stock-log-info__label">Quantity</span>
                <span>{{ formatQuantity(entry.quantityDelta) }} {{ entry.unitAbbreviation }}</span>
            </div>

            <div v-if="entry.eventType === 'LOST'" class="stock-log-info__meta-row">
                <span class="stock-log-info__label">Loss reason</span>
                <span v-if="entry.lossReason">{{ entry.lossReason }}</span>
                <span v-else class="stock-log-info__placeholder">Not specified</span>
            </div>

            <div class="stock-log-info__meta-row">
                <span class="stock-log-info__label">Notes</span>
                <span v-if="entry.notes">{{ entry.notes }}</span>
                <span v-else class="stock-log-info__placeholder">No notes</span>
            </div>
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import { useRoute } from 'vue-router'

    import { APICall } from '@/service/api/api'

    import TheLayout from '@/components/layout/TheLayout.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'
    import SectionTitle from '@/components/base/SectionTitle.vue'
    import TheLink from '@/components/base/TheLink.vue'
    import router from '@/router'

    interface StockLogEntry {
        id: number
        product: { id: number; name: string }
        user: { id: number; fullName: string }
        eventType: string
        quantityDelta: number
        unitAbbreviation: string
        createdAt: string
        lossReason: string | null
        notes: string | null
    }

    const route = useRoute()

    const loading = ref(true)
    const entry = ref<StockLogEntry | undefined>(undefined)

    function formatDateTime(ts: string): string {
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        }).format(new Date(ts))
    }

    function formatQuantity(delta: number): string {
        return String(Math.abs(delta))
    }

    async function fetchEntry() {
        loading.value = true
        try {
            entry.value = await new APICall<StockLogEntry>(`warehouse-batches/log/${route.params.id}`).execute()
        } finally {
            loading.value = false
        }
    }

    onMounted(() => fetchEntry())
</script>

<style lang="scss">
    .stock-log-info__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .stock-log-info__header-meta {
        display: flex;
        align-items: center;
        gap: 15px;
        color: #666;
        margin-bottom: 20px;
    }

    .stock-log-info__header-time {
        color: #666;
    }

    .stock-log-info__meta-row {
        display: flex;
        align-items: center;
        gap: 6px;
        min-height: 25px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .stock-log-info__label {
        font-weight: bold;
        width: 100%;
        flex-shrink: 0;
        color: black;
    }

    .stock-log-info__placeholder {
        color: #999;
    }
</style>
