<template>
    <div 
        class="recipe-ingredient-categories-ingredient-row"
        @click="router.push({ name: 'product-info', params: { id: props.ingredient.id } })"
    >
        <p class="recipe-ingredient-categories-ingredient-row__name">{{ ingredient.name }}</p>
        <TheButton
            type="important"
            class="recipe-ingredient-categories-ingredient-row__remove"
            @click.stop="openRemoveIngredientPopup(ingredient, parentCategory)"
        >
            Remove
        </TheButton>
    </div>
</template>

<script setup lang="ts">
    import type { RecipeIngredientCategory, RecipeIngredientCategoryProduct } from './recipe-ingredient-categories-models';
    import { inject } from 'vue';
    import router from '@/router';

    import TheButton from '@/components/base/TheButton.vue';

    interface Props {
        ingredient: RecipeIngredientCategoryProduct
        parentCategory: RecipeIngredientCategory
    }

    const props = defineProps<Props>();

    const openRemoveIngredientPopup: (ingredient: RecipeIngredientCategoryProduct, parentCategory: RecipeIngredientCategory) => void = inject('openRemoveIngredientPopup')!;
</script>

<style lang="scss">
    .recipe-ingredient-categories-ingredient-row {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
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

        p {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    .recipe-ingredient-categories-ingredient-row__remove {
        padding: 4px 10px;
        flex-shrink: 0;
    }
</style>
