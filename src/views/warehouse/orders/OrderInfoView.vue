<template>
    <TheLayout>
        <div v-if="!order" class="order-info-view__loader">
            <TheSpinner size="lg" />
        </div>

        <template v-else>
            <TheTitle>Order #{{ order.id }}</TheTitle>

            <div v-if="order.status === 'PENDING'" class="order-info-view__toolbar">
                <TheButton
                    class="order-info-view__button"
                    @click="router.push({ name: 'receive-order', params: { id: order.id } })"
                >
                    Receive
                </TheButton>

                <TheButton
                    class="order-info-view__button"
                    type="important"
                    @click="cancelPopupOpen = true"
                >
                    Cancel
                </TheButton>
            </div>

            <div class="order-info-view__wrapper">
                <div class="order-info-view__details">
                    <SectionTitle>Details</SectionTitle>

                    <div class="order-info-view__meta-row">
                        <span class="order-info-view__label">Status</span>
                        <span :class="['order-info-view__status', `order-info-view__status--${order.status.toLowerCase()}`]">
                            {{ statusLabel }}
                        </span>
                    </div>

                    <div class="order-info-view__meta-row">
                        <span class="order-info-view__label">Created at</span>
                        <span>{{ formatDate(order.createdAt) }}</span>
                    </div>

                    <div class="order-info-view__meta-row">
                        <span class="order-info-view__label">Placed by</span>
                        <span
                            class="order-info-view__link"
                            @click="router.push({ name: 'user-info', params: { id: order.placedBy.id } })"
                        >{{ order.placedBy.fullName }}</span>
                    </div>

                    <div v-if="order.finalizedBy" class="order-info-view__meta-row">
                        <span class="order-info-view__label">Finalized by</span>
                        <span
                            class="order-info-view__link"
                            @click="router.push({ name: 'user-info', params: { id: order.finalizedBy.id } })"
                        >{{ order.finalizedBy.fullName }}</span>
                    </div>

                    <div class="order-info-view__meta-row">
                        <span class="order-info-view__label">Supplier</span>
                        <span
                            class="order-info-view__link"
                            @click="router.push({ name: 'supplier-info', params: { id: order.supplier.id } })"
                        >{{ order.supplier.name }}</span>
                    </div>

                    <div class="order-info-view__meta-row">
                        <span class="order-info-view__label">Expected delivery</span>
                        <span>{{ formatDate(order.expectedDelivery) }}</span>
                    </div>

                    <div v-if="order.actualDelivery" class="order-info-view__meta-row">
                        <span class="order-info-view__label">Actual delivery</span>
                        <span>{{ formatDate(order.actualDelivery) }}</span>
                    </div>

                    <SectionTitle>Notes</SectionTitle>
                    <p v-if="order.notes" class="order-info-view__text">{{ order.notes }}</p>
                    <p v-else class="order-info-view__placeholder">No notes</p>
                </div>

                <div class="order-info-view__products">
                    <SectionTitle>Products</SectionTitle>

                    <template v-if="order.products.length">
                        <div class="order-info-view__product-row order-info-view__product-row--header">
                            <span class="order-info-view__product-name">Product</span>
                            <span class="order-info-view__product-qty">Expected</span>
                            <span class="order-info-view__product-qty">Received</span>
                        </div>
                        <div
                            v-for="product in order.products"
                            :key="product.id"
                            class="order-info-view__product-row"
                        >
                            <span class="order-info-view__product-name">{{ product.name }}</span>
                            <span class="order-info-view__product-qty">{{ product.expectedQuantity }} {{ product.unit.abbreviation }}</span>
                            <span class="order-info-view__product-qty">
                                {{ product.receivedQuantity != null ? `${product.receivedQuantity} ${product.unit.abbreviation}` : '-' }}
                            </span>
                        </div>
                    </template>

                    <p v-else class="order-info-view__placeholder">No products</p>
                </div>
            </div>
            
            <CancelOrderPopup
                v-if="cancelPopupOpen && order"
                :order-id="order.id"
                @cancelled="router.replace({ name: 'orders' })"
                @close="cancelPopupOpen = false"
            />
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import TheLayout from '@/components/layout/TheLayout.vue'
import TheTitle from '@/components/layout/TheTitle.vue'
import TheButton from '@/components/base/TheButton.vue'
import TheSpinner from '@/components/base/TheSpinner.vue'
import SectionTitle from '@/components/base/SectionTitle.vue'
import CancelOrderPopup from '@/components/warehouse/orders/CancelOrderPopup.vue'

import { useRoute, useRouter } from 'vue-router'

import { APICall } from '@/service/api/api'
import type { OrderDetail } from '@/components/warehouse/orders/orders-models'

const route = useRoute()
const router = useRouter()

const order = ref<OrderDetail | undefined>(undefined)
const cancelPopupOpen = ref(false)

const statusLabel = computed(() => {
    const map: Record<string, string> = {
        PENDING: 'Pending',
        RECEIVED: 'Received',
        CANCELLED: 'Cancelled',
    }
    return map[order.value?.status ?? ''] ?? order.value?.status ?? ''
})

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function fetchOrder() {
    order.value = await new APICall<OrderDetail>(`orders/${route.params.id}`).execute()
}

onMounted(() => fetchOrder())
</script>

<style lang="scss">
    .order-info-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .order-info-view__toolbar {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        margin-bottom: 20px;
    }

    .order-info-view__button {
        width: 90px;
        padding: 4px;
    }

    .order-info-view__wrapper {
        display: flex;
        flex-direction: column;
        gap: 30px;

        @include desktop {
            flex-direction: row;
            align-items: flex-start;
        }
    }

    .order-info-view__details {
        min-width: 0;
        width: 100%;

        @include desktop {
            width: 280px;
            flex-shrink: 0;
        }
    }

    .order-info-view__products {
        flex: 1;
        min-width: 0;
    }

    .order-info-view__meta-row {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .order-info-view__label {
        font-weight: bold;
        width: 100%;
        flex-shrink: 0;
        color: black;
    }

    .order-info-view__status {
        padding: 4px 10px;
        border-radius: 3px;
        font-size: 14px;

        &--pending { background: #fff3cd; color: #856404; border: 1px solid #856404; }
        &--received { background: #d4edda; color: #256236; border: 1px solid #256236; }
        &--cancelled { background: #f5c6cb; color: #721c24; border: 1px solid #721c24; }
    }

    .order-info-view__link {
        cursor: pointer;
        color: #2d5aa0;
        text-decoration: underline;

        &:hover {
            color: #1a3d7a;
        }
    }

    .order-info-view__text {
        margin-bottom: 8px;
        line-height: 1.5;
        white-space: pre-wrap;
    }

    .order-info-view__placeholder {
        color: #999;
        margin-bottom: 8px;
    }

    .order-info-view__product-row {
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

    .order-info-view__product-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 12px;
    }

    .order-info-view__product-qty {
        width: 120px;
        flex-shrink: 0;
        text-align: right;
    }
</style>
