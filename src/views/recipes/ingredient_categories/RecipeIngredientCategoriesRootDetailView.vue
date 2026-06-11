<template>
    <div
        v-if="(categories ?? []).length == 0"    
        class="reicpe-ingredient-category-detail--root--no-categories"
    >
        Ingredient categories will appear here when you add them
    </div>
    <div 
        v-else
        class="recipe-ingredient-category-detail--root"
    >
        <TheTitle style="width: 100%;">All categories</TheTitle>

        <RecipeIngredientCategorySubcategoriesTable 
            :sub-categories="categories!" 
        />
    </div>
</template>

<script setup lang="ts">
    import { RecipeIngredientCategory } from '@/components/recipes/ingredient_categories/recipe-ingredient-categories-models';
    import { inject, Ref } from 'vue';

    import TheTitle from '@/components/layout/TheTitle.vue';
    import RecipeIngredientCategorySubcategoriesTable from '@/components/recipes/ingredient_categories/RecipeIngredientCategorySubcategoriesTable.vue';

    const categories = inject<Ref<RecipeIngredientCategory[] | undefined>>('categories');
</script>

<style lang="scss">
    .reicpe-ingredient-category-detail--root--no-categories{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }

    .recipe-ingredient-category-detail--root {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
</style>