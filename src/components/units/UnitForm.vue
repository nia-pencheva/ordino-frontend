<template>
    <TheForm class="unit-form">
        <FormElement
            id="unit"
            :errors="errors?.getByField('unit')"
        >
            <template #label>Name</template>
            <template #default="defaultProps">
                <TextInput
                    v-model="unit"
                    :id="defaultProps.id"
                    type="text"
                    placeholder="Name"
                />
            </template>
        </FormElement>

        <FormElement
            id="abbreviation"
            :errors="errors?.getByField('abbreviation')"
        >
            <template #label>Abbreviation</template>
            <template #default="defaultProps">
                <TextInput
                    v-model="abbreviation"
                    :id="defaultProps.id"
                    type="text"
                    placeholder="Abbreviation"
                />
            </template>
        </FormElement>

        <FormElement
            v-if="route.name == 'edit-unit'" 
            id="category"
        >
            <template #label>Category</template>
            <template #default="defaultProps">
                <TheSelect 
                    v-model="categoryId"
                    :id="defaultProps.id"
                    :options="props.unit?.allUnitCategories.map(category => ({ value: category.id, label: category.category }))!"
                    placeholder="Select unit category"
                />
            </template>
        </FormElement>

        <br />

        <div class="unit-form__buttons__wrapper">
            <TheButton
                @click="handleSubmit()"
                class="unit-form__button"
                :disabled="submitting"
            >
                <span :class="{ 'unit-form__button-label--hidden': submitting }">
                    <span v-if="route.name == 'add-unit'">Add</span>
                    <span v-if="route.name == 'edit-unit'">Save</span>
                </span>
                <TheSpinner v-if="submitting" size="xs" class="unit-form__spinner" />
            </TheButton>
            <TheButton
                @click="router.back()"
                class="unit-form__button"
                type="important"
            >
                Cancel
            </TheButton>
        </div>
        
    </TheForm>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { EditUnitResponse } from './units-models';
    import { useRoute, useRouter } from 'vue-router';
    import { APICall } from '@/service/api/api';
    import { UnprocessableContentError } from '@/service/api/models/response-errors';

    import TextInput from '../base/TextInput.vue';
    import FormElement from '../base/form/FormElement.vue';
    import TheForm from '../base/form/TheForm.vue';
    import TheButton from '../base/TheButton.vue';
    import TheSpinner from '../base/TheSpinner.vue';
    import TheSelect from '../base/TheSelect.vue';

    const route = useRoute();
    const router = useRouter();

    interface Props {
        unit?: EditUnitResponse
    }

    const props = defineProps<Props>();

    const unit = ref<string>(props.unit?.unit ?? '');
    const abbreviation = ref<string>(props.unit?.abbreviation ?? '');
    const categoryId = ref<number | null>(props.unit?.categoryId ?? null)
    const errors = ref<UnprocessableContentError | undefined>(undefined);
    const submitting = ref<boolean>(false);

    async function handleSubmit() {
        submitting.value = true;

        try {
            const data = {
                unit: unit.value.trim(),
                abbreviation: abbreviation.value.trim(),
                categoryId: route.query.id ?? categoryId.value
            };

            if (route.name == 'add-unit') {
                await addUnit(data);
            } else {
                await saveUnit(data);
            }
        } catch (error: any) {
            if (error instanceof UnprocessableContentError) {
                errors.value = error;
            }
        } finally {
            submitting.value = false;
        }
    }

    async function addUnit(data: Record<string, unknown>) {
        await (new APICall('units', 'POST', data)).execute();
        router.replace({ name: 'units' });
    }

    async function saveUnit(data: Record<string, unknown>) {
        await (new APICall('units/' + props.unit?.id, 'POST', data)).execute();
        router.replace({ name: 'units' });
    }
</script>

<style lang="scss">
    .unit-form {
        max-width: 350px;
        width: 100%;
    }

    .unit-form__buttons__wrapper {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .unit-form__button {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .unit-form__button-label--hidden {
        visibility: hidden;
    }

    .unit-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
