<template>
    <div 
        class="recipe-ingredient-categories-subcategory-row"
        @click="router.push({ name: 'recipe-ingredient-category-detail', params: { id: subCategory.id } })"    
    >
        <span class="recipe-ingredient-categories-subcategory-row__name">{{ subCategory.category }}</span>
    </div>
</template>

<script setup lang="ts">
    import router from '@/router';
    import type { RecipeIngredientCategory } from './recipe-ingredient-categories-models';

    interface Props {
        subCategory: RecipeIngredientCategory
    }

    const props = defineProps<Props>();
</script>

<style lang="scss">
    .recipe-ingredient-categories-subcategory-row {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        height: $tableRowHeight;
        padding: 10px;
        border: 1px solid $midGray;
        border-radius: 5px;

        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1.00),
            inset 0 -1px 0 rgba(255, 255, 255, 0.40),
            inset 1px 0 0 rgba(255, 255, 255, 0.55),
            inset -1px 0 0 rgba(255, 255, 255, 0.55),
            0 1px 2px rgba(0, 0, 0, 0.20),
            0 1px 0 rgba(255, 255, 255, 0.60);
    }

    .recipe-ingredient-categories-subcategory-row__name {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>
