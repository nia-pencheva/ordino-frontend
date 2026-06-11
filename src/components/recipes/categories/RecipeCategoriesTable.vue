<template>
    <div class="recipe-categories-table">
        <RecipeCategoriesTableRow
            v-for="recipeCategory in recipeCategories"
            :key="recipeCategory.id"
            :recipeCategory="recipeCategory"
            @delete="emit('delete', $event)"
        />
    </div>
</template>

<script setup lang="ts">
    import { RecipeCategory } from './recipe-categories-models';
    import RecipeCategoriesTableRow from './RecipeCategoriesTableRow.vue';

    interface Props {
        recipeCategories: RecipeCategory[] | undefined
    }

    const props = defineProps<Props>();
    const emit = defineEmits<{
        delete: [recipeCategory: RecipeCategory]
    }>();
</script>

<style lang="scss">
    .recipe-categories-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }
</style>
