<template>
    <TheLayout :content-styles="['mark-stock-quantity-used-view']">
        <TheTitle v-if="batch">Mark {{ batch.product.name }} batch #{{ batch.id }} quantity as used</TheTitle>

        <TheForm class="mark-quantity-used-form">
            <FormElement id="quantity" :errors="errors?.getByField('quantity')">
                <template #label>Quantity</template>
                <template #default>
                    <div class="mark-quantity-used-form__quantity-row">
                        <NumberInput
                            v-model="quantity"
                            class="mark-quantity-used-form__quantity-input"
                            :min="0.001"
                            :placeholder="batch?.unitAbbreviation ?? ''"
                            :invalid="!!errors?.getByField('quantity').length"
                        />
                        <span class="mark-quantity-used-form__unit">{{ batch?.unitAbbreviation }}</span>
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

            <div class="mark-quantity-used-form__buttons">
                <TheButton
                    @click="handleSubmit"
                    class="mark-quantity-used-form__button"
                    :disabled="submitting"
                >
                    <span :class="{ 'mark-quantity-used-form__button-label--hidden': submitting }">Confirm</span>
                    <TheSpinner v-if="submitting" size="xs" class="mark-quantity-used-form__spinner" />
                </TheButton>

                <TheButton
                    @click="router.back()"
                    class="mark-quantity-used-form__button"
                    type="important"
                >
                    Cancel
                </TheButton>
            </div>
        </TheForm>
    </TheLayout>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    import { APICall } from '@/service/api/api'
    import { UnprocessableContentError } from '@/service/api/models/response-errors'

    import TheLayout from '@/components/layout/TheLayout.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'
    import TheForm from '@/components/base/form/TheForm.vue'
    import FormElement from '@/components/base/form/FormElement.vue'
    import NumberInput from '@/components/base/NumberInput.vue'
    import TextArea from '@/components/base/TextArea.vue'
    import TheButton from '@/components/base/TheButton.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'

    interface BatchInfo {
        id: number
        product: { id: number; name: string }
        unitAbbreviation: string
    }

    const route = useRoute()
    const router = useRouter()

    const batch = ref<BatchInfo | null>(null)
    const quantity = ref<number | null>(null)
    const notes = ref<string>('')
    const errors = ref<UnprocessableContentError | undefined>(undefined)
    const submitting = ref<boolean>(false)

    async function fetchBatch() {
        batch.value = await new APICall<BatchInfo>(
            `warehouse-batches/${route.params.productId}/${route.params.batchId}`
        ).execute()
    }

    async function handleSubmit() {
        submitting.value = true
        errors.value = undefined

        try {
            const { redirect } = await new APICall<{ redirect: string }>(`warehouse-batches/${route.params.batchId}/mark-used`, 'POST', {
                quantity: quantity.value,
                notes: notes.value.trim() || null
            } as Record<string, unknown>).execute()

            if (redirect === 'product') {
                router.replace({ name: 'product-stock', params: { productId: route.params.productId } })
            } else if (redirect === 'stock') {
                router.replace({ name: 'stock' })
            } else {
                router.back()
            }
        } catch (error) {
            if (error instanceof UnprocessableContentError) {
                errors.value = error
            }
        } finally {
            submitting.value = false
        }
    }

    onMounted(async () => {
        await fetchBatch()
    })
</script>

<style lang="scss">
    .mark-stock-quantity-used-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .mark-quantity-used-form {
        max-width: 450px;
        width: 100%;
    }

    .mark-quantity-used-form__quantity-row {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    input.mark-quantity-used-form__quantity-input {
        width: 80px;
    }

    .mark-quantity-used-form__unit {
        min-width: 24px;
        flex-shrink: 0;
    }

    .mark-quantity-used-form__buttons {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .mark-quantity-used-form__button {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .mark-quantity-used-form__button-label--hidden {
        visibility: hidden;
    }

    .mark-quantity-used-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
