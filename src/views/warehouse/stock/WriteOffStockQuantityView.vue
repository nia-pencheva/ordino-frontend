<template>
    <TheLayout :content-styles="['write-off-stock-quantity-view']">
        <TheTitle v-if="batch">Write off {{ batch.product.name }} batch #{{ batch.id }} quantity</TheTitle>

        <TheForm class="write-off-quantity-form">
            <FormElement id="quantity" :errors="errors?.getByField('quantity')">
                <template #label>Quantity</template>
                <template #default>
                    <div class="write-off-quantity-form__quantity-row">
                        <NumberInput
                            v-model="quantity"
                            class="write-off-quantity-form__quantity-input"
                            :min="0.001"
                            :placeholder="batch?.unitAbbreviation ?? ''"
                            :invalid="!!errors?.getByField('quantity').length"
                        />
                        <span class="write-off-quantity-form__unit">{{ batch?.unitAbbreviation }}</span>
                    </div>
                </template>
            </FormElement>

            <FormElement id="lossReasonId" :errors="errors?.getByField('lossReasonId')">
                <template #label>Loss reason</template>
                <template #default>
                    <TheSelect
                        v-model="lossReasonId"
                        :options="lossReasonOptions"
                        placeholder="Select loss reason..."
                        :invalid="!!errors?.getByField('lossReasonId').length"
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

            <div class="write-off-quantity-form__buttons">
                <TheButton
                    @click="handleSubmit"
                    class="write-off-quantity-form__button"
                    :disabled="submitting"
                >
                    <span :class="{ 'write-off-quantity-form__button-label--hidden': submitting }">Confirm</span>
                    <TheSpinner v-if="submitting" size="xs" class="write-off-quantity-form__spinner" />
                </TheButton>

                <TheButton
                    @click="router.back()"
                    class="write-off-quantity-form__button"
                    type="important"
                >
                    Cancel
                </TheButton>
            </div>
        </TheForm>
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue'
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
    import TheSelect, { type SelectOption } from '@/components/base/TheSelect.vue'

    interface BatchInfo {
        id: number
        product: { id: number; name: string }
        unitAbbreviation: string
    }

    interface LossReason {
        id: number
        reason: string
    }

    interface LossReasonsPage {
        lossReasons: LossReason[]
    }

    const route = useRoute()
    const router = useRouter()

    const batch = ref<BatchInfo | null>(null)
    const lossReasons = ref<LossReason[]>([])
    const quantity = ref<number | null>(null)
    const lossReasonId = ref<string | number | null>(null)
    const notes = ref<string>('')
    const errors = ref<UnprocessableContentError | undefined>(undefined)
    const submitting = ref<boolean>(false)

    const lossReasonOptions = computed<SelectOption[]>(() =>
        lossReasons.value.map(r => ({ value: r.id, label: r.reason }))
    )

    async function fetchBatch() {
        batch.value = await new APICall<BatchInfo>(
            `warehouse-batches/${route.params.productId}/${route.params.batchId}`
        ).execute()
    }

    async function fetchLossReasons() {
        const page = await new APICall<LossReasonsPage>('loss-reasons?pageSize=1000').execute()
        lossReasons.value = page.lossReasons
    }

    async function handleSubmit() {
        submitting.value = true
        errors.value = undefined

        try {
            const { redirect } = await new APICall<{ redirect: string }>(`warehouse-batches/${route.params.batchId}/write-off`, 'POST', {
                quantity: quantity.value,
                lossReasonId: lossReasonId.value,
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
        await Promise.all([fetchBatch(), fetchLossReasons()])
    })
</script>

<style lang="scss">
    .write-off-stock-quantity-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .write-off-quantity-form {
        max-width: 450px;
        width: 100%;
    }

    .write-off-quantity-form__quantity-row {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    input.write-off-quantity-form__quantity-input {
        width: 80px;
    }

    .write-off-quantity-form__unit {
        min-width: 24px;
        flex-shrink: 0;
    }

    .write-off-quantity-form__buttons {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .write-off-quantity-form__button {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .write-off-quantity-form__button-label--hidden {
        visibility: hidden;
    }

    .write-off-quantity-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
