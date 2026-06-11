<template>
    <TheForm class="recipe-category-form">
        <FormElement
            id="category"
            :errors="errors?.getByField('category')"
        >
            <template #label>Category</template>
            <template #default="defaultProps">
                <TextInput
                    v-model="category"
                    :id="defaultProps.id"
                    type="text"
                    placeholder="Category"
                />
            </template>
        </FormElement>

        <br />

        <div class="recipe-category-form__buttons__wrapper">
            <TheButton
                @click="handleSubmit()"
                class="recipe-category-form__button"
                :disabled="submitting"
            >
                <span :class="{ 'recipe-category-form__button-label--hidden': submitting }">
                    <span v-if="route.name == 'add-recipe-category'">Add</span>
                    <span v-if="route.name == 'edit-recipe-category'">Save</span>
                </span>
                <TheSpinner v-if="submitting" size="xs" class="recipe-category-form__spinner" />
            </TheButton>

            <TheButton
                @click="router.back()"
                class="recipe-category-form__button"
                type="important"
            >
                Cancel
            </TheButton>
        </div>
    </TheForm>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { RecipeCategory } from './recipe-categories-models';
    import { useRoute, useRouter } from 'vue-router';
    import { APICall } from '@/service/api/api';
    import { UnprocessableContentError } from '@/service/api/models/response-errors';

    import TextInput from '@/components/base/TextInput.vue';
    import FormElement from '@/components/base/form/FormElement.vue';
    import TheForm from '@/components/base/form/TheForm.vue';
    import TheButton from '@/components/base/TheButton.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';

    const route = useRoute();
    const router = useRouter();

    interface Props {
        recipeCategory?: RecipeCategory
    }

    const props = defineProps<Props>();

    const category = ref<string>(props.recipeCategory?.category ?? '');
    const errors = ref<UnprocessableContentError | undefined>(undefined);
    const submitting = ref<boolean>(false);

    async function handleSubmit() {
        submitting.value = true;

        try {
            const data = { category: category.value.trim() };

            if (route.name == 'add-recipe-category') {
                await addRecipeCategory(data);
            } else {
                await editRecipeCategory(data);
            }
        } catch (error: any) {
            if (error instanceof UnprocessableContentError) {
                errors.value = error;
            }
        } finally {
            submitting.value = false;
        }
    }

    async function addRecipeCategory(data: Record<string, unknown>) {
        await (new APICall('recipe-categories', 'POST', data)).execute();
        router.back();
    }

    async function editRecipeCategory(data: Record<string, unknown>) {
        await (new APICall('recipe-categories/' + props.recipeCategory?.id, 'POST', data)).execute();
        router.back();
    }
</script>

<style lang="scss">
    .recipe-category-form {
        max-width: 350px;
        width: 100%;
    }

    .recipe-category-form__buttons__wrapper {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .recipe-category-form__button {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .recipe-category-form__button-label--hidden {
        visibility: hidden;
    }

    .recipe-category-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
