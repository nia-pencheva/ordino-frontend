<template>
    <TheForm class="supplier-product-form">
        <FormElement
            id="price"
            :errors="validationErrors?.getByField('price')"
        >
            <template #label>Price ({{ currency }})</template>
            <template #default="defaultProps">
                <NumberInput
                    :id="defaultProps.id"
                    v-model="price"
                    :min="0.01"
                    placeholder="Price"
                />
            </template>
        </FormElement>

        <FormElement
            id="min-order-quantity"
            :errors="validationErrors?.getByField('minOrderQuantity')"
        >
            <template #label>Minimum order quantity ({{ unitAbbreviation }})</template>
            <template #default="defaultProps">
                <div class="supplier-product-form__quantity-row">
                    <NumberInput
                        :id="defaultProps.id"
                        v-model="minOrderQuantity"
                        :min="0.001"
                        placeholder="Min. order quantity"
                    />
                </div>
            </template>
        </FormElement>

        <br />

        <div class="supplier-product-form__buttons">
            <TheButton
                @click="handleSubmit"
                class="supplier-product-form__button"
                :disabled="submitting"
            >
                <span :class="{ 'supplier-product-form__button-label--hidden': submitting }">
                    <span v-if="mode !== 'edit'">Add</span>
                    <span v-else>Save</span>
                </span>
                <TheSpinner v-if="submitting" size="xs" class="supplier-product-form__spinner" />
            </TheButton>

            <TheButton
                @click="emit('cancel')"
                class="supplier-product-form__button"
                type="important"
            >
                Cancel
            </TheButton>
        </div>
    </TheForm>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { UnprocessableContentError } from '@/service/api/models/response-errors'

    import FormElement from '@/components/base/form/FormElement.vue'
    import TheForm from '@/components/base/form/TheForm.vue'
    import NumberInput from '@/components/base/NumberInput.vue'
    import TheButton from '@/components/base/TheButton.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'

    interface Props {
        initialPrice?: number
        initialMinOrderQuantity?: number
        unitAbbreviation?: string
        mode?: 'add' | 'edit'
        validationErrors?: UnprocessableContentError
        submitting?: boolean
    }

    const props = defineProps<Props>()

    const emit = defineEmits<{
        submit: [{ price: number | undefined; minOrderQuantity: number | undefined }]
        cancel: []
    }>()

    const currency = process.env.VUE_APP_CURRENCY

    const price = ref<number | undefined>(props.initialPrice)
    const minOrderQuantity = ref<number | undefined>(props.initialMinOrderQuantity)

    function handleSubmit() {
        emit('submit', { price: price.value, minOrderQuantity: minOrderQuantity.value })
    }
</script>

<style lang="scss">
    .supplier-product-form {
        max-width: 350px;
        width: 100%;
    }

    .supplier-product-form__quantity-row {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .supplier-product-form__buttons {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .supplier-product-form__button {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .supplier-product-form__button-label--hidden {
        visibility: hidden;
    }

    .supplier-product-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
