<template>
    <TheLayout :content-styles="['edit-recipe-ingredient-category-view']">
        <TheTitle>Edit recipe ingredient category</TheTitle>

        <br>

        <div class="edit-recipe-ingredient-category-view__loader" v-if="!loaded">
            <TheSpinner size="lg" />
        </div>

        <RecipeIngredientCategoryForm
            v-else
            :recipe-ingredient-category="recipeIngredientCategory"
            :parent-catgory-id="recipeIngredientCategory?.parentCategoryId"
        />
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import RecipeIngredientCategoryForm from '@/components/recipes/ingredient_categories/RecipeIngredientCategoryForm.vue';
    import { RecipeIngredientCategoryForEditing } from '@/components/recipes/ingredient_categories/recipe-ingredient-categories-models';
    import { fetchRecipeIngredientCategoryForEditing } from '@/components/recipes/ingredient_categories/recipe-ingredient-categories-utils';

    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';

    const route = useRoute();

    const recipeIngredientCategory = ref<RecipeIngredientCategoryForEditing | undefined>(undefined);

    const loaded = computed<boolean>(() => recipeIngredientCategory.value !== undefined);

    onMounted(async () => {
        recipeIngredientCategory.value = await fetchRecipeIngredientCategoryForEditing(parseInt(route.params.id as string));
    });
</script>

<style lang="scss">
    .edit-recipe-ingredient-category-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .edit-recipe-ingredient-category-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
