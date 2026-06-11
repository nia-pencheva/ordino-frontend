<template>
    <TheLayout :content-styles="[ 'add-recipe-ingredient-category-view' ]">
        <template v-if="route.params.id">
            <div class="edit-unit-view__loader" v-if="recipeIngredientCategory === undefined">
                <TheSpinner size="lg" />
            </div>
            <template v-else>
                <TheTitle style="text-align: center;">
                    Add subcategory to <br>recipe ingredient category <br /> {{ recipeIngredientCategory?.category }}
                </TheTitle>

                <RecipeIngredientCategoryForm
                    :parent-catgory-id="recipeIngredientCategory.id"
                />
            </template>
        </template>
        <template v-else>
            <TheTitle>
                Add recipe ingredient category
            </TheTitle>

            <RecipeIngredientCategoryForm />
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import { onMounted, ref } from 'vue';
    import { fetchRecipeIngredientCategoryForEditing } from '@/components/recipes/ingredient_categories/recipe-ingredient-categories-utils';
    import { RecipeIngredientCategoryForEditing } from '@/components/recipes/ingredient_categories/recipe-ingredient-categories-models';

    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import RecipeIngredientCategoryForm from '@/components/recipes/ingredient_categories/RecipeIngredientCategoryForm.vue';
import TheSpinner from '@/components/base/TheSpinner.vue';

    const route = useRoute();

    const recipeIngredientCategory = ref<RecipeIngredientCategoryForEditing | undefined>(undefined);

    onMounted(async () => {
        if(route.params.id)
            recipeIngredientCategory.value = await fetchRecipeIngredientCategoryForEditing(parseInt(route.params.id.toString()));
    })
</script>

<style lang="scss">
    .add-recipe-ingredient-category-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>