<template>
    <TheForm class="warehouse-product-form">
        <FormElement
            id="unit-select"
            :errors="validationErrors?.getByField('unitId')"
        >
            <template #label>Unit</template>
            <template #default="defaultProps">
                <TheSelect
                    :id="defaultProps.id"
                    :options="unitOptions"
                    v-model="unitId"
                    placeholder="Unit"
                    class="warehouse-product-form__unit-select"
                    leaf-only
                    :invalid="(validationErrors?.getByField('unitId')?.length ?? 0) > 0"
                />
            </template>
        </FormElement>

        <FormElement
            id="min-quantity"
            :errors="validationErrors?.getByField('minQuantity')"
        >
            <template #label>Minimum quantity</template>
            <template #default="defaultProps">
                <NumberInput
                    :id="defaultProps.id"
                    v-model="minQuantity"
                    :min="0.001"
                    placeholder="Minimum quantity"
                />
            </template>
        </FormElement>

        <div class="warehouse-product-form__buttons">
            <TheButton
                @click="handleSubmit()"
                class="warehouse-product-form__button"
                :disabled="submitting"
            >
                <span :class="{ 'warehouse-product-form__button-label--hidden': submitting }">
                    <span v-if="mode !== 'edit'">Add</span>
                    <span v-else>Save</span>
                </span>
                <TheSpinner v-if="submitting" size="xs" class="warehouse-product-form__spinner" />
            </TheButton>
            <TheButton
                @click="emit('cancel')"
                class="warehouse-product-form__button"
                type="important"
            >
                Cancel
            </TheButton>
        </div>
    </TheForm>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { APICall } from '@/service/api/api';
    import { UnprocessableContentError } from '@/service/api/models/response-errors';

    import FormElement from '@/components/base/form/FormElement.vue';
    import TheForm from '@/components/base/form/TheForm.vue';
    import NumberInput from '@/components/base/NumberInput.vue';
    import TheButton from '@/components/base/TheButton.vue';
    import TheSelect, { SelectOption } from '@/components/base/TheSelect.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';

    const router = useRouter();

    interface UnitForSelect {
        id: number
        unit: string
        abbreviation: string
    }

    interface UnitCategoryForSelect {
        id: number
        category: string
        units: UnitForSelect[]
    }

    interface AllUnitsForSelect {
        unitCategories: UnitCategoryForSelect[]
    }

    interface Props {
        initialUnitId?: number
        initialMinQuantity?: number
        mode?: 'add' | 'edit'
        validationErrors?: UnprocessableContentError
        submitting?: boolean
    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        submit: [{ unitId: number | null; minQuantity: number | undefined }],
        cancel: []
    }>();

    const unitId = ref<number | null>(props.initialUnitId ?? null);
    const minQuantity = ref<number | undefined>(props.initialMinQuantity);
    const unitOptions = ref<SelectOption[]>([]);

    function handleSubmit() {
        emit('submit', { unitId: unitId.value, minQuantity: minQuantity.value });
    }

    onMounted(async () => {
        const data = await (new APICall<AllUnitsForSelect>('units?pageSize=1000')).execute();
        unitOptions.value = data.unitCategories.map(cat => ({
            value: cat.id,
            label: cat.category,
            children: cat.units.map(u => ({
                value: u.id,
                label: `${u.unit} (${u.abbreviation})`
            }))
        }));
    });
</script>

<style lang="scss">
    .warehouse-product-form {
        max-width: 350px;
        width: 100%;
    }

    .warehouse-product-form__unit-select {
        width: 100%;
    }

    .warehouse-product-form__buttons {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .warehouse-product-form__button {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .warehouse-product-form__button-label--hidden {
        visibility: hidden;
    }

    .warehouse-product-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
