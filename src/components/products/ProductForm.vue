<template>
    <TheForm
        class="product-form"
        @enter-pressed="handleSubmit"
    >
        <FormElement
            id="name"
            :errors="errors?.getByField('name')"
        >
            <template #label>Name</template>
            <template #default="defaultProps">
                <TextInput
                    v-model="name"
                    :id="defaultProps.id"
                    type="text"
                    placeholder="Name"
                />
            </template>
        </FormElement>

        <FormElement
            id="notes"
            :errors="errors?.getByField('notes')"
        >
            <template #label>Notes</template>
            <template #default="defaultProps">
                <TextArea
                    v-model="notes"
                    :id="defaultProps.id"
                    placeholder="Notes"
                    rows="5"
                ></TextArea>
            </template>
        </FormElement>

        <br />

        <TheButton
            @click="handleSubmit()"
            class="product-form__submit"
            :disabled="submitting"
        >
            <span :class="{ 'product-form__submit-label--hidden': submitting }">
                <span v-if="route.name == 'add-product'">Add</span>
                <span v-if="route.name == 'edit-product'">Save</span>
            </span>
            <TheSpinner v-if="submitting" size="xs" class="product-form__spinner" />
        </TheButton>
    </TheForm>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { Product } from './products-models';
    import { useRoute, useRouter } from 'vue-router';
    import { APICall } from '@/service/api/api';
    import { UnprocessableContentError } from '@/service/api/models/response-errors';

    import TextInput from '../base/TextInput.vue';
    import TextArea from '../base/TextArea.vue';
    import FormElement from '../base/form/FormElement.vue';
    import TheForm from '../base/form/TheForm.vue';
    import TheButton from '../base/TheButton.vue';
    import TheSpinner from '../base/TheSpinner.vue';

    const route = useRoute();
    const router = useRouter();

    interface Props {
        product?: Product
    }

    const props = defineProps<Props>();

    const name = ref<string>(props.product?.name ?? '');
    const notes = ref<string>(props.product?.notes ?? '');
    const errors = ref<UnprocessableContentError | undefined>(undefined);
    const submitting = ref<boolean>(false);

    async function handleSubmit() {
        submitting.value = true;

        try {
            const data = {
                name: name.value.trim(),
                notes: notes.value.trim() || null
            };

            if (route.name == 'add-product') {
                await addProduct(data);
            } else {
                await editProduct(data);
            }
        } catch (error: any) {
            if (error instanceof UnprocessableContentError) {
                errors.value = error;
            }
        } finally {
            submitting.value = false;
        }
    }

    async function addProduct(data: Record<string, unknown>) {
        await (new APICall('products', 'POST', data)).execute();
        router.replace({ name: 'products' });
    }

    async function editProduct(data: Record<string, unknown>) {
        await (new APICall('products/' + props.product?.id, 'POST', data)).execute();
        router.replace({ name: 'products' });
    }
</script>

<style lang="scss">
    .product-form {
        max-width: 350px;
        width: 100%;
    }

    .product-form__submit {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .product-form__submit-label--hidden {
        visibility: hidden;
    }

    .product-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
