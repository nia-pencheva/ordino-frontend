<template>
    <TheForm class="unit-category-form">
        <FormElement
            id="category"
            :errors="errors?.getByField('category')"
        >
            <template #label>Name</template>
            <template #default="defaultProps">
                <TextInput
                    v-model="category"
                    :id="defaultProps.id"
                    type="text"
                    placeholder="Name"
                />
            </template>
        </FormElement>

        <br />

        <div class="unit-category-form__buttons__wrapper">
            <TheButton
                @click="handleSubmit()"
                class="unit-category-form__button"
                :disabled="submitting"
            >
                <span :class="{ 'unit-category-form__button-label--hidden': submitting }">
                    <span v-if="route.name == 'add-unit-category'">Add</span>
                    <span v-if="route.name == 'edit-unit-category'">Save</span>
                </span>
                <TheSpinner v-if="submitting" size="xs" class="unit-category-form__spinner" />
            </TheButton>
            <TheButton
                @click="router.back()"
                class="unit-category-form__button"
                type="important"
            >
                Cancel
            </TheButton>
        </div>
    </TheForm>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { UnitCategoryForEditing } from './units-models';
    import { UnprocessableContentError } from '@/service/api/models/response-errors';
    import { APICall } from '@/service/api/api';
    import { useRoute, useRouter } from 'vue-router';

    import FormElement from '../base/form/FormElement.vue';
    import TheForm from '../base/form/TheForm.vue';
    import TextInput from '../base/TextInput.vue';
    import TheButton from '../base/TheButton.vue';
    import TheSpinner from '../base/TheSpinner.vue';

    const route = useRoute();
    const router = useRouter();

    interface Props {
        unitCategory?: UnitCategoryForEditing 
    }

    const props = defineProps<Props>();

    const category = ref<string>(props.unitCategory?.category ?? '');
    const errors = ref<UnprocessableContentError | undefined>(undefined);
    const submitting = ref<boolean>(false);

    async function handleSubmit() {
        submitting.value = true;

        try {
            const data = {
                category: category.value.trim()
            };

            if (route.name == 'add-unit-category') {
                await addUnitCategory(data);
            } else {
                await saveUnitCategory(data);
            }
        } catch (error: any) {
            if (error instanceof UnprocessableContentError) {
                errors.value = error;
            }
        } finally {
            submitting.value = false;
        }
    }

    async function addUnitCategory(data: Record<string, unknown>) {
        await (new APICall('unit-categories', 'POST', data)).execute();
        router.replace({ name: 'units' });
    }

    async function saveUnitCategory(data: Record<string, unknown>) {
        await (new APICall('unit-categories/' + props.unitCategory?.id, 'POST', data)).execute();
        router.replace({ name: 'units' });
    }
</script>

<style lang="scss">
    .unit-category-form {
        max-width: 350px;
        width: 100%;
    }

    .unit-category-form__buttons__wrapper {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .unit-category-form__button {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .unit-category-form__button-label--hidden {
        visibility: hidden;
    }

    .unit-category-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
