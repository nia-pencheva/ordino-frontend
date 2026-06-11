<template>
    <TheForm class="warehouse-product-category-form">
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

        <div class="warehouse-product-category-form__buttons__wrapper">
            <TheButton
                @click="handleSubmit()"
                class="warehouse-product-category-form__button"
                :disabled="submitting"
            >
                <span :class="{ 'warehouse-product-category-form__button-label--hidden': submitting }">
                    <span v-if="[ 'add-warehouse-product-category', 'add-warehouse-product-subcategory' ].includes(route.name as string)">Add</span>
                    <span v-if="route.name == 'edit-warehouse-product-category'">Save</span>
                </span>
                <TheSpinner v-if="submitting" size="xs" class="warehouse-product-category-form__spinner" />
            </TheButton>
            <TheButton
                @click="router.back()"
                class="warehouse-product-category-form__button"
                type="important"
            >
                Cancel
            </TheButton>
        </div>
    </TheForm>
</template>

<script setup lang="ts">
    import { useRoute, useRouter } from 'vue-router';
    import { WarehouseProductCategoryForEditing } from './warehouse-product-categories-models';
    import { ref } from 'vue';
    import { UnprocessableContentError } from '@/service/api/models/response-errors';
    import { APICall } from '@/service/api/api';

    import FormElement from '@/components/base/form/FormElement.vue';
    import TheForm from '@/components/base/form/TheForm.vue';
    import TextInput from '@/components/base/TextInput.vue';
    import TheButton from '@/components/base/TheButton.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';

    const route = useRoute();
    const router = useRouter();

    interface Props {
        warehouseProductCategory?: WarehouseProductCategoryForEditing
        parentCategoryId?: number
    }

    const props = defineProps<Props>();

    const category = ref<string>(props.warehouseProductCategory?.category ?? '');
    const parentCategoryId = ref<number | null>(props.parentCategoryId ?? null);
    const errors = ref<UnprocessableContentError | undefined>(undefined);
    const submitting = ref<boolean>(false);

    async function handleSubmit() {
        submitting.value = true;

        try {
            const data = {
                category: category.value.trim(),
                parentId: parentCategoryId.value
            };

            if ([ 'add-warehouse-product-category', 'add-warehouse-product-subcategory' ].includes(route.name?.toString() ?? "")) {
                await addWarehouseProductCategory(data);
            } else {
                await saveWarehouseProductCategory(data);
            }

            router.back();
        } catch (error: any) {
            if (error instanceof UnprocessableContentError) {
                errors.value = error;
            }
        } finally {
            submitting.value = false;
        }
    }

    async function addWarehouseProductCategory(data: Record<string, unknown>) {
        await (new APICall('warehouse-product-categories', 'POST', data)).execute();
    }

    async function saveWarehouseProductCategory(data: Record<string, unknown>) {
        await (new APICall('warehouse-product-categories/' + props.warehouseProductCategory?.id, 'POST', data)).execute();
    }
</script>

<style lang="scss">
    .warehouse-product-category-form {
        max-width: 350px;
        width: 100%;
    }

    .warehouse-product-category-form__buttons__wrapper {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .warehouse-product-category-form__button {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .warehouse-product-category-form__button-label--hidden {
        visibility: hidden;
    }

    .warehouse-product-category-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
