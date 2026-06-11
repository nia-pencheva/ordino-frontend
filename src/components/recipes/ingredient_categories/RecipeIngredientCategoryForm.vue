<template>
    <TheForm class="recipe-ingredient-category-form">
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

        <div class="recipe-ingredient-category-form__buttons__wrapper">
            <TheButton
                @click="handleSubmit()"
                class="recipe-ingredient-category-form__button"
                :disabled="submitting"
            >
                <span :class="{ 'recipe-ingredient-category-form__button-label--hidden': submitting }">
                    <span v-if="[ 'add-recipe-ingredient-category', 'add-recipe-ingredient-subcategory' ].includes(route.name as string)">Add</span>
                    <span v-if="route.name == 'edit-recipe-ingredient-category'">Save</span>
                </span>
                <TheSpinner v-if="submitting" size="xs" class="recipe-ingredient-category-form__spinner" />
            </TheButton>
            <TheButton
                @click="router.back()"
                class="recipe-ingredient-category-form__button"
                type="important"
            >
                Cancel
            </TheButton>
        </div>
    </TheForm>
</template>

<script setup lang="ts">
    import { useRoute, useRouter } from 'vue-router';
    import { RecipeIngredientCategoryForEditing } from './recipe-ingredient-categories-models';
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
        recipeIngredientCategory?: RecipeIngredientCategoryForEditing 
        parentCatgoryId?: number 
    }

    const props = defineProps<Props>();

    const category = ref<string>(props.recipeIngredientCategory?.category ?? '');
    const parentCategoryId = ref<number | null>(props.parentCatgoryId ?? null)
    const errors = ref<UnprocessableContentError | undefined>(undefined);
    const submitting = ref<boolean>(false);

    async function handleSubmit() {
        submitting.value = true;

        try {
            const data = {
                category: category.value.trim(),
                parentId: parentCategoryId.value
            };

            if([ 'add-recipe-ingredient-category', 'add-recipe-ingredient-subcategory' ].includes(route.name?.toString() ?? "")) {
                await addRecipeIngredientCategory(data);
            } else {
                await saveRecipeIngredientCategory(data);
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

    async function addRecipeIngredientCategory(data: Record<string, unknown>) {
        await (new APICall('recipe-ingredient-categories', 'POST', data)).execute();
    }

    async function saveRecipeIngredientCategory(data: Record<string, unknown>) {
        await (new APICall('recipe-ingredient-categories/' + props.recipeIngredientCategory?.id, 'POST', data)).execute();
    }
</script>

<style lang="scss">
    .recipe-ingredient-category-form {
        max-width: 350px;
        width: 100%;
    }

    .recipe-ingredient-category-form__buttons__wrapper {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .recipe-ingredient-category-form__button {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .recipe-ingredient-category-form__button-label--hidden {
        visibility: hidden;
    }

    .recipe-ingredient-category-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
