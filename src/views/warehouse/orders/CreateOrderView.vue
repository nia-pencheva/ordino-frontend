<template>
    <TheLayout :content-styles="['create-order-view']">
        <TheTitle>Create order</TheTitle>

        <TheForm class="create-order-form">
            <FormElement id="supplierId" :errors="errors?.getByField('supplierId')">
                <template #label>Supplier</template>
                <template #default>
                    <TheSelect
                        v-model="supplierId"
                        :options="supplierOptions"
                        placeholder="Select supplier..."
                        :invalid="!!errors?.getByField('supplierId').length"
                    />
                </template>
            </FormElement>

            <FormElement id="products" :errors="errors?.getByField('products')">
                <template #label>Products</template>
                <template #default>
                    <TheSelect
                        v-model="selectedProductId"
                        :options="productOptions"
                        placeholder="Select product..."
                        :disabled="supplierId == null"
                        :invalid="!!errors?.getByField('products').length"
                    />

                    <div v-if="selectedProducts.length > 0" class="create-order-form__product-list">
                        <div
                            v-for="(item, index) in selectedProducts"
                            :key="item.warehouseProductId"
                            class="create-order-form__product-row"
                        >
                            <span class="create-order-form__product-name">{{ item.productName }}</span>

                            <div class="create-order-form__product-quantity">
                                <NumberInput
                                    v-model="item.expectedQuantity"
                                    :min="0.001"
                                    :placeholder="item.unitAbbreviation"
                                    class="create-order-form__quantity-input"
                                />
                                <span class="create-order-form__product-unit">{{ item.unitAbbreviation }}</span>
                            </div>

                            <span
                                class="create-order-form__product-remove"
                                @click="removeProduct(index)"
                            >
                                ×
                            </span>
                        </div>
                    </div>
                </template>
            </FormElement>

            <FormElement id="expectedDelivery" :errors="errors?.getByField('expectedDelivery')">
                <template #label>Expected delivery</template>
                <template #default>
                    <input
                        v-model="expectedDelivery"
                        id="expectedDelivery"
                        type="date"
                        :min="minDate"
                        class="create-order-form__date-input"
                    />
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

            <div class="create-order-form__buttons">
                <TheButton
                    @click="handleSubmit"
                    class="create-order-form__button"
                    :disabled="submitting"
                >
                    <span :class="{ 'create-order-form__button-label--hidden': submitting }">Create</span>
                    <TheSpinner v-if="submitting" size="xs" class="create-order-form__spinner" />
                </TheButton>

                <TheButton
                    @click="router.back()"
                    class="create-order-form__button"
                    type="important"
                >
                    Cancel
                </TheButton>
            </div>
        </TheForm>
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref, watch } from 'vue'
    import { useRouter } from 'vue-router'

    import { APICall } from '@/service/api/api'
    import { UnprocessableContentError } from '@/service/api/models/response-errors'
    import { SuppliersPage, SupplierProductsPage, SupplierProduct } from '@/components/warehouse/suppliers/suppliers-models'

    import TheLayout from '@/components/layout/TheLayout.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'
    import TheForm from '@/components/base/form/TheForm.vue'
    import FormElement from '@/components/base/form/FormElement.vue'
    import TheSelect, { type SelectOption } from '@/components/base/TheSelect.vue'
    import TextArea from '@/components/base/TextArea.vue'
    import TheButton from '@/components/base/TheButton.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'
    import NumberInput from '@/components/base/NumberInput.vue'

    interface SelectedProduct {
        warehouseProductId: number
        productName: string
        unitAbbreviation: string
        expectedQuantity: number | null
    }

    const router = useRouter()

    const supplierId = ref<string | number | null>(null)
    const supplierOptions = ref<SelectOption[]>([])
    const catalogProducts = ref<SupplierProduct[]>([])
    const selectedProductId = ref<string | number | null>(null)
    const selectedProducts = ref<SelectedProduct[]>([])
    const expectedDelivery = ref<string>('')
    const notes = ref<string>('')
    const errors = ref<UnprocessableContentError | undefined>(undefined)
    const submitting = ref<boolean>(false)

    const minDate = computed<string>(() => new Date().toISOString().split('T')[0])

    const productOptions = computed<SelectOption[]>(() =>
        catalogProducts.value.map(p => ({
            value: p.warehouseProductId,
            label: p.productName,
            disabled: selectedProducts.value.some(s => s.warehouseProductId === p.warehouseProductId)
        }))
    )

    watch(supplierId, async (newId) => {
        selectedProducts.value = []
        catalogProducts.value = []
        selectedProductId.value = null
        if (newId != null) {
            await fetchCatalogProducts(newId as number)
        }
    })

    watch(selectedProductId, (productId) => {
        if (productId == null) return
        const product = catalogProducts.value.find(p => p.warehouseProductId === productId)
        if (!product) return
        selectedProducts.value.push({
            warehouseProductId: product.warehouseProductId,
            productName: product.productName,
            unitAbbreviation: product.unitAbbreviation,
            expectedQuantity: null
        })
        selectedProductId.value = null
    })

    async function fetchSuppliers() {
        const page = await new APICall<SuppliersPage>('suppliers?active=true&pageSize=1000').execute()
        supplierOptions.value = page.suppliers.map(s => ({ value: s.id, label: s.name }))
    }

    async function fetchCatalogProducts(id: number) {
        const page = await new APICall<SupplierProductsPage>(`suppliers/${id}/products?pageSize=1000`).execute()
        catalogProducts.value = page.products
    }

    function removeProduct(index: number) {
        selectedProducts.value.splice(index, 1)
    }

    async function handleSubmit() {
        submitting.value = true
        errors.value = undefined

        try {
            await new APICall('orders/create', 'POST', {
                supplierId: supplierId.value,
                products: selectedProducts.value.map(p => ({
                    warehouseProductId: p.warehouseProductId,
                    expectedQuantity: p.expectedQuantity
                })),
                expectedDelivery: expectedDelivery.value
                    ? new Date(expectedDelivery.value + 'T00:00:00').toISOString()
                    : null,
                notes: notes.value.trim() || null
            } as Record<string, unknown>).execute()

            router.replace({ name: 'orders' })
        } catch (error) {
            if (error instanceof UnprocessableContentError) {
                errors.value = error
            }
        } finally {
            submitting.value = false
        }
    }

    onMounted(async () => {
        await fetchSuppliers()
    })
</script>

<style lang="scss">
    .create-order-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .create-order-form {
        max-width: 450px;
        width: 100%;
    }

    .create-order-form__product-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 8px;
    }

    .create-order-form__product-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 10px;
        background: white;
        border: 1px solid $midGray;
        border-radius: 4px;

        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1.00),
            0 1px 2px rgba(0, 0, 0, 0.10);
    }

    .create-order-form__product-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .create-order-form__product-quantity {
        display: flex;
        align-items: center;
        gap: 5px;
        flex-shrink: 0;
    }

    input.create-order-form__quantity-input {
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

    .create-order-form__product-unit {
        min-width: 24px;
    }

    .create-order-form__product-remove {
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
        color: #2d5aa0;

        &:hover {
            color: #c0392b;
        }
    }

    .create-order-form__date-input {
        height: 30px;
        width: 100%;
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

    .create-order-form__buttons {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .create-order-form__button {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .create-order-form__button-label--hidden {
        visibility: hidden;
    }

    .create-order-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
