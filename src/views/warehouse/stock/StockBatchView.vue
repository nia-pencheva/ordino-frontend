<template>
    <TheLayout>
        <div v-if="!batch" class="stock-batch-view__loader">
            <TheSpinner size="lg" />
        </div>

        <template v-else>
            <TheTitle>{{ batch.product.name }} batch #{{ batch.id }}</TheTitle>

            <div class="stock-batch-view__toolbar">
                <TheButton
                    class="stock-batch-view__action-button"
                    @click="router.push({ name: 'mark-stock-quantity-used', params: { productId: route.params.productId, batchId: batch.id } })"
                >
                    Mark Used
                </TheButton>

                <TheButton
                    class="stock-batch-view__action-button"
                    @click="router.push({ name: 'write-off-stock-quantity', params: { productId: route.params.productId, batchId: batch.id } })"
                >
                    Write Off
                </TheButton>
            </div>

            <div class="stock-batch-view__panels">
                <div class="stock-batch-view__panel stock-batch-view__panel--information">
                    <SectionTitle>Information</SectionTitle>

                    <div class="stock-batch-view__meta-row">
                        <span class="stock-batch-view__label">Order</span>
                        <TheLink
                            v-if="batch.orderId"
                            @click="router.push({ name: 'order-info', params: { id: batch.orderId } })"
                        >
                            #{{ batch.orderId }}
                        </TheLink>
                        <span v-else class="stock-batch-view__placeholder">—</span>
                    </div>

                    <div class="stock-batch-view__meta-row">
                        <span class="stock-batch-view__label">Quantity</span>
                        <span>{{ batch.quantity }} {{ batch.unitAbbreviation }}</span>
                    </div>

                    <div class="stock-batch-view__meta-row">
                        <span class="stock-batch-view__label">Expiry date</span>
                        <span>{{ batch.expiryDate ?? '—' }}</span>
                    </div>
                </div>

                <div class="stock-batch-view__panel stock-batch-view__panel--events">
                    <SectionTitle>Events</SectionTitle>

                    <template v-if="batch.events.length">
                        <div class="stock-batch-view__event-row stock-batch-view__event-row--header">
                            <span class="stock-batch-view__event-type">Event type</span>
                            <span class="stock-batch-view__event-qty">Quantity</span>
                            <span class="stock-batch-view__event-date">Date</span>
                        </div>

                        <div
                            v-for="event in batch.events"
                            :key="event.id"
                            class="stock-batch-view__event-row"
                        >
                            <span class="stock-batch-view__event-type">{{ event.eventType }}</span>
                            <span
                                class="stock-batch-view__event-qty"
                                :class="event.quantityDelta >= 0 ? 'stock-batch-view__qty--positive' : 'stock-batch-view__qty--negative'"
                            >
                                {{ event.quantityDelta > 0 ? '+' : '' }}{{ event.quantityDelta }}
                            </span>
                            <span class="stock-batch-view__event-date">{{ formatDate(event.createdAt) }}</span>
                        </div>
                    </template>

                    <p v-else class="stock-batch-view__placeholder">No events</p>
                </div>
            </div>
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    import { APICall } from '@/service/api/api'

    import TheLayout from '@/components/layout/TheLayout.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'
    import SectionTitle from '@/components/base/SectionTitle.vue'
    import TheButton from '@/components/base/TheButton.vue'
    import TheLink from '@/components/base/TheLink.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'

    interface BatchProduct {
        id: number
        name: string
    }

    interface EventUser {
        id: number
        fullName: string
    }

    interface BatchEvent {
        id: number
        user: EventUser
        eventType: string
        quantityDelta: number
        createdAt: string
        lossReason: string | null
        notes: string | null
    }

    interface Batch {
        id: number
        product: BatchProduct
        orderId: number | null
        quantity: number
        unitAbbreviation: string
        expiryDate: string | null
        events: BatchEvent[]
    }

    const route = useRoute()
    const router = useRouter()

    const batch = ref<Batch | undefined>(undefined)

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
        batch.value = await new APICall<Batch>(
            `warehouse-batches/${route.params.productId}/${route.params.batchId}`
        ).execute()
    })
</script>

<style lang="scss">
    .stock-batch-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .stock-batch-view__toolbar {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        margin-bottom: 20px;
    }

    .stock-batch-view__action-button {
        width: 100px;
        padding: 4px;
    }

    .stock-batch-view__panels {
        display: flex;
        flex-direction: column;
        gap: 10px;

        @include desktop {
            flex-direction: row;
            align-items: flex-start;
        }
    }

    .stock-batch-view__panel {
        min-width: 0;
        flex-shrink: 0;
        width: 100%;

        @include desktop {
            width: auto;
        }

        &--information {
            flex: 1;
        }

        &--events {
            @include desktop {
                width: 300px;
            }
        }
    }

    .stock-batch-view__meta-row {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .stock-batch-view__label {
        font-weight: bold;
        width: 100%;
        flex-shrink: 0;
        color: black;
    }

    .stock-batch-view__placeholder {
        color: #999;
        margin-bottom: 8px;
    }

    .stock-batch-view__event-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 8px 0;

        &--header {
            font-weight: bold;
            border-bottom: 1px solid $lightGrayBorder;
            padding-bottom: 6px;
        }
    }

    .stock-batch-view__event-type {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 8px;
    }

    .stock-batch-view__event-qty {
        width: 80px;
        flex-shrink: 0;
        text-align: right;
        margin-right: 8px;
    }

    .stock-batch-view__event-date {
        width: 130px;
        flex-shrink: 0;
        text-align: right;
    }

    .stock-batch-view__qty--positive {
        color: #256236;
    }

    .stock-batch-view__qty--negative {
        color: #721c24;
    }
</style>
