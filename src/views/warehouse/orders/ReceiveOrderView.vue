<template>
    <TheLayout :content-styles="['receive-order-view']">
        <div v-if="!order" class="receive-order-view__loader">
            <TheSpinner size="lg" />
        </div>

        <template v-else>
            <TheTitle>Receive order #{{ order.id }}</TheTitle>

            <TheForm class="receive-order-form">
                <FormElement id="products" :errors="errors?.getByField('products')">
                    <template #label>Products</template>
                    <template #default>
                        <div class="receive-order-form__product-list">
                            <div
                                v-for="(item, index) in productForms"
                                :key="item.warehouseProductId"
                                class="receive-order-form__product-row"
                            >
                                <div class="receive-order-form__product-row__name-and-expected-wrapper">
                                    <span class="receive-order-form__product-name">{{ item.productName }}</span>
                                </div>    


                                <div class="receive-order-form__product-row__quantity-and-expiry-date-wrapper">
                                    <FormElement
                                        id="received-quantity"
                                        :errors="errors?.getByField(`products[${index}].receivedQuantity`) ?? []"
                                    >
                                        <template #label>Received</template>
                                        <template #default="defaultProps">
                                            <div class="receive-order-form__received">
                                                <NumberInput
                                                    :id="defaultProps"
                                                    v-model="item.receivedQuantity"
                                                    :min="0"
                                                    placeholder="0"
                                                    class="receive-order-form__quantity-input"
                                                />
                                                <span class="receive-order-form__unit">
                                                    {{ item.unitAbbreviation }}
                                                    <span class="receive-order-form__expected-qty">
                                                        (Expected {{ item.expectedQuantity }} {{ item.unitAbbreviation }})
                                                    </span>
                                                </span>
                                            </div>
                                        </template>
                                    </FormElement>

                                    <FormElement
                                        id="expiry-date"
                                        :errors="errors?.getByField(`products[${index}].expiryDate`)"
                                    >
                                        <template #label>Expiry date</template>
                                        <template #default="defaultProps">
                                            <input
                                                :id="defaultProps.id"
                                                v-model="item.expiryDate"
                                                type="date"
                                                :min="minDate"
                                                class="receive-order-form__date-input"
                                            />
                                        </template>
                                    </FormElement>
                                </div>
                            </div>
                        </div>
                    </template>
                </FormElement>

                <FormElement id="notes" :errors="errors?.getByField('notes')">
                    <template #label>Notes</template>
                    <template #default="defaultProps">
                        <TextArea
                            v-model="notes"
                            :id="defaultProps.id"
                            placeholder="Optional notes..."
                            rows="3"
                        />
                    </template>
                </FormElement>

                <br />

                <div class="receive-order-form__buttons">
                    <TheButton
                        @click="handleSubmit"
                        class="receive-order-form__button"
                        :disabled="submitting"
                    >
                        <span :class="{ 'receive-order-form__button-label--hidden': submitting }">Receive</span>
                        <TheSpinner v-if="submitting" size="xs" class="receive-order-form__spinner" />
                    </TheButton>

                    <TheButton
                        @click="router.back()"
                        class="receive-order-form__button"
                        type="important"
                    >
                        Cancel
                    </TheButton>
                </div>
            </TheForm>
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import TheLayout from '@/components/layout/TheLayout.vue'
import TheTitle from '@/components/layout/TheTitle.vue'
import TheForm from '@/components/base/form/TheForm.vue'
import FormElement from '@/components/base/form/FormElement.vue'
import TextArea from '@/components/base/TextArea.vue'
import TheButton from '@/components/base/TheButton.vue'
import TheSpinner from '@/components/base/TheSpinner.vue'
import NumberInput from '@/components/base/NumberInput.vue'

import { useRoute, useRouter } from 'vue-router'

import { APICall } from '@/service/api/api'
import { UnprocessableContentError } from '@/service/api/models/response-errors'
import type { OrderDetail } from '@/components/warehouse/orders/orders-models'

interface ProductForm {
    warehouseProductId: number
    productName: string
    expectedQuantity: number
    unitAbbreviation: string
    receivedQuantity: number | null
    expiryDate: string
}

const route = useRoute()
const router = useRouter()

const order = ref<OrderDetail | undefined>(undefined)
const productForms = ref<ProductForm[]>([])
const notes = ref('')
const errors = ref<UnprocessableContentError | undefined>(undefined)
const submitting = ref(false)

const minDate = computed<string>(() => new Date().toISOString().split('T')[0])

async function fetchOrder() {
    order.value = await new APICall<OrderDetail>(`orders/${route.params.id}`).execute()
    productForms.value = order.value.products.map(p => ({
        warehouseProductId: p.warehouseProductId,
        productName: p.name,
        expectedQuantity: p.expectedQuantity,
        unitAbbreviation: p.unit.abbreviation,
        receivedQuantity: null,
        expiryDate: ''
    }))
}

async function handleSubmit() {
    submitting.value = true
    errors.value = undefined

    try {
        await new APICall(`orders/${route.params.id}/receive`, 'POST', {
            products: productForms.value.map(p => ({
                warehouseProductId: p.warehouseProductId,
                receivedQuantity: p.receivedQuantity,
                expiryDate: p.expiryDate
                    ? new Date(p.expiryDate + 'T00:00:00').toISOString()
                    : null
            })),
            notes: notes.value.trim() || null
        } as Record<string, unknown>).execute()

        router.replace({ name: 'order-info', params: { id: route.params.id } })
    } catch (error) {
        if (error instanceof UnprocessableContentError) {
            errors.value = error
        }
    } finally {
        submitting.value = false
    }
}

onMounted(() => fetchOrder())
</script>

<style lang="scss">
    .receive-order-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .receive-order-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .receive-order-form {
        max-width: 700px;
        width: 100%;
    }

    .receive-order-form__product-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 8px;
    }

    .receive-order-form__product-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        background: white;
        border: 1px solid $midGray;
        border-radius: 4px;
        flex-wrap: wrap;

        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1.00),
            0 1px 2px rgba(0, 0, 0, 0.10);
    }

    .receive-order-form__product-row__name-and-expected-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .receive-order-form__product-row__quantity-and-expiry-date-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        width: 100%;

        & > * {
            width: auto;
        }
    }

    .receive-order-form__product-name {
        flex: 1;
        min-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: bold;
    }

    .receive-order-form__expected-qty {
        color: rgba(0, 0, 0, 0.5);
        flex-shrink: 0;
        min-width: 60px;
        text-align: right;
    }

    .receive-order-form__received {
        display: flex;
        align-items: center;
        gap: 5px;
        flex-shrink: 0;
    }

    input.receive-order-form__quantity-input {
        width: 80px;
        height: 28px;
        border-radius: 3px;
        padding: 3px 6px;
        border: 1px solid rgba(100, 130, 170, 0.55);
        background-color: #fff;
        color: #1a1a1a;
        outline: none;

        box-shadow:
            inset 0 1px 3px rgba(0, 0, 0, 0.15),
            0 1px 0 rgba(255, 255, 255, 0.80);

        &:focus {
            border-color: rgba(60, 120, 210, 0.90);
            box-shadow:
                inset 0 1px 3px rgba(0, 0, 0, 0.12),
                0 0 0 2px rgba(80, 150, 230, 0.28);
        }
    }

    .receive-order-form__unit {
        min-width: 24px;
    }

    .receive-order-form__date-input {
        width: 180px;
        height: 28px;
        flex-shrink: 0;
        border-radius: 3px;
        padding: 3px 6px;
        border: 1px solid rgba(100, 130, 170, 0.55);
        background-color: #fff;
        color: #1a1a1a;
        outline: none;

        box-shadow:
            inset 0 1px 3px rgba(0, 0, 0, 0.20),
            0 1px 0 rgba(255, 255, 255, 0.80);

        &:focus {
            border-color: rgba(60, 120, 210, 0.90);
            box-shadow:
                inset 0 1px 3px rgba(0, 0, 0, 0.18),
                0 0 0 2px rgba(80, 150, 230, 0.28);
        }
    }

    .receive-order-form__buttons {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .receive-order-form__button {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .receive-order-form__button-label--hidden {
        visibility: hidden;
    }

    .receive-order-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
