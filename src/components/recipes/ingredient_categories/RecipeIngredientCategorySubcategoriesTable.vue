<template>
    <div class="recipe-ingredient-categories-subcategories__table-and-pager-wrapper">
        <div class="recipe-ingredient-categories-subcategories-table">
            <RecipeIngredientCategorySubcategoryRow
                v-for="subCategory in pagedSubCategories"
                :key="subCategory.id"
                :sub-category="subCategory"
                :parent-category="props.parentCategory"
            />
        </div>
        <ThePager
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @previous="previousPage"
            @next="nextPage"
        />
    </div>
    
</template>

<script setup lang="ts">
    import { ref, computed, inject, Ref } from 'vue';
    import type { RecipeIngredientCategory } from './recipe-ingredient-categories-models';

    import RecipeIngredientCategorySubcategoryRow from './RecipeIngredientCategorySubcategoryRow.vue';
    import ThePager from '@/components/base/ThePager.vue';

    interface Props {
        subCategories: RecipeIngredientCategory[]
        parentCategory?: RecipeIngredientCategory
    }

    const props = defineProps<Props>();

    const currentPage = inject<Ref<number>>("currentPage")!;
    const nextPage = inject<() => void>("nextPage");
    const previousPage = inject<() => void>("previousPage")

    const pageSize = 10;

    const totalPages = computed(() => Math.ceil(props.subCategories.length / pageSize));

    const pagedSubCategories = computed(() =>
        props.subCategories.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
    );
</script>

<style lang="scss">
    .recipe-ingredient-categories-subcategories__table-and-pager-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .recipe-ingredient-categories-subcategories-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }
</style>
