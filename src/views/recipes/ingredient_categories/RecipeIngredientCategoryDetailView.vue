<template>
    <div
        v-if="category !== undefined"
        class="recipe-ingredient-category-detail"
    >
        <TheTitle>{{ category.category }}</TheTitle>

        <!-- Non-leaf -->
        <template v-if="!isLeaf">
            <div class="recipe-ingredient-category-detail__toolbar">
                <TheButton 
                    class="recipe-ingredient-category-detail__toolbar__button"
                    @click="router.push({ name: 'add-recipe-ingredient-subcategory', params: { id: category.id } })"
                >
                    Add Subcategory
                </TheButton>
                <TheButton 
                    class="recipe-ingredient-category-detail__toolbar__button"
                    @click="router.push({ name: 'edit-recipe-ingredient-category', params: { id: category.id } })"
                >
                    Edit
                </TheButton>
                <TheButton 
                    class="recipe-ingredient-category-detail__toolbar__button"
                    @click.stop="router.push({ name: 'move-recipe-ingredient-category', params: { id: category.id } })"
                >
                    Move
                </TheButton>
                <TheButton 
                    class="recipe-ingredient-category-detail__toolbar__button" 
                    type="important"
                    @click="openRemoveCategoryPopup($event, category)"
                >
                    Delete
                </TheButton>
            </div>

            <SectionTitle>Subcategories</SectionTitle>

            <RecipeIngredientCategorySubcategoriesTable 
                :sub-categories="category.subCategories!"
            />

            <p class="recipe-ingredient-category-detail__note">
                Ingredients are set only at the leaf category level. Click on a subcategory in the tree on the left to get to the leaf level.
            </p>
        </template>

        <!-- Leaf with no ingredients -->
        <template v-else-if="!hasIngredients">
            <div class="recipe-ingredient-category-detail__toolbar">
                <TheButton 
                    class="recipe-ingredient-category-detail__toolbar__button"
                    @click="router.push({ name: 'add-recipe-ingredient-subcategory', params: { id: category.id } })"
                >
                    Add Subcategory
                </TheButton>
                <TheButton 
                    class="recipe-ingredient-category-detail__toolbar__button"
                    @click="router.push({ name: 'add-recipe-ingredient-category-product', params: { id: category.id }, query: { categoryName: category.category } })"
                >
                    Add Ingredient
                </TheButton>
                <TheButton 
                    class="recipe-ingredient-category-detail__toolbar__button"
                    @click.stop="router.push({ name: 'move-recipe-ingredient-category', params: { id: category.id } })"
                >
                    Move
                </TheButton>
                <TheButton 
                    class="recipe-ingredient-category-detail__toolbar__button"
                    @click="router.push({ name: 'edit-recipe-ingredient-category', params: { id: category.id } })"
                >
                    Edit
                </TheButton>
                <TheButton 
                    class="recipe-ingredient-category-detail__toolbar__button" 
                    type="important"
                    @click="openRemoveCategoryPopup($event, category)"
                >
                    Delete
                </TheButton>
            </div>

            <div class="recipe-ingredient-category-detail__empty">
                <p>No ingredients or subcategories have been added yet</p>
            </div>
        </template>

        <!-- Leaf with ingredients -->
        <template v-else>
            <div class="recipe-ingredient-category-detail__toolbar">
                <TheButton 
                    class="recipe-ingredient-category-detail__toolbar__button"
                    @click="router.push({ name: 'add-recipe-ingredient-category-product', params: { id: category.id }, query: { categoryName: category.category } })"
                >
                    Add Ingredient
                </TheButton>
                <TheButton 
                    class="recipe-ingredient-category-detail__toolbar__button"
                    @click.stop="router.push({ name: 'move-recipe-ingredient-category', params: { id: category.id } })"
                >
                    Move
                </TheButton>
                <TheButton 
                    class="recipe-ingredient-category-detail__toolbar__button"
                    @click="router.push({ name: 'edit-recipe-ingredient-category', params: { id: category.id } })"
                >
                    Edit
                </TheButton>
                <TheButton 
                    class="recipe-ingredient-category-detail__toolbar__button" 
                    type="important"
                    @click="openRemoveCategoryPopup($event, category)"
                >
                    Delete
                </TheButton>
            </div>

            <SectionTitle>Ingredients</SectionTitle>

            <div class="recipe-ingredient-category-detail__ingredients-wrapper">
                <div class="recipe-ingredient-category-detail__ingredients">
                    <RecipeIngredientCategoryIngredientRow
                        v-for="ingredient in pagedIngredients"
                        :key="ingredient.id"
                        :ingredient="ingredient"
                        :parent-category="category"
                    />
                </div>

                <ThePager
                    v-if="totalIngredientPages > 1"
                    :current-page="currentPage"
                    :total-pages="totalIngredientPages"
                    @previous="previousPage"
                    @next="nextPage"
                />
                </div>
        </template>

    </div>
</template>

<script setup lang="ts">
    import { ref, computed, inject, watch, type Ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { type RecipeIngredientCategory, type RecipeIngredientCategoryProduct } from '@/components/recipes/ingredient_categories/recipe-ingredient-categories-models';
    import { findCategoryById } from '@/components/recipes/ingredient_categories/recipe-ingredient-categories-utils';
    import router from '@/router';

    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheButton from '@/components/base/TheButton.vue';
    import ThePager from '@/components/base/ThePager.vue';
    import RecipeIngredientCategorySubcategoriesTable from '@/components/recipes/ingredient_categories/RecipeIngredientCategorySubcategoriesTable.vue';
    import RecipeIngredientCategoryIngredientRow from '@/components/recipes/ingredient_categories/RecipeIngredientCategoryIngredientRow.vue';
import SectionTitle from '@/components/base/SectionTitle.vue';
import { useNotFound } from '@/store/not-found/not-found';

    const route = useRoute();

    const categories = inject<Ref<RecipeIngredientCategory[] | undefined>>('categories');
    const currentPage = inject<Ref<number>>("currentPage")!;
    const nextPage = inject<() => void>("nextPage")!;
    const previousPage = inject<() => void>("previousPage")!;
    const setPage = inject<(page: number) => void>("setPage")!;

    const ingredientPageSize = 10;

    const category = ref<RecipeIngredientCategory | undefined>(undefined);

    const isLeaf = computed(() => !category.value?.subCategories?.length);
    
    const hasIngredients = computed(() => (category.value?.products?.length ?? 0) > 0);
    
    const ingredients = computed<RecipeIngredientCategoryProduct[]>(() => {
        return category.value?.products ?? [];
    });

    const totalIngredientPages = computed(() =>
        Math.ceil((ingredients).value.length / ingredientPageSize)
    );

    const pagedIngredients = computed(() =>
        ingredients.value.slice(
            (currentPage.value - 1) * ingredientPageSize,
            currentPage.value * ingredientPageSize
        )
    );

    watch(() => route.params.id, async (id) => {
        setPage(1);

        const found = findCategoryById(categories?.value ?? [], Number(id));

        if(found == undefined) {
            useNotFound().show();
            return;
        }

        category.value = found;
    }, { immediate: true });

    watch(() => categories?.value, () => {
        category.value = findCategoryById(categories?.value ?? [], Number(route.params.id));
    });

     const openRemoveCategoryPopup: (event: MouseEvent, category: RecipeIngredientCategory) => void = inject('openRemoveCategoryPopup')!;
</script>

<style lang="scss">
    .recipe-ingredient-category-detail {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .recipe-ingredient-category-detail__toolbar {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 5px;
        margin-bottom: 20px;
    }

    .recipe-ingredient-category-detail__toolbar__button {
        width: 130px;
        padding: 4px 10px;
    }

    .recipe-ingredient-category-detail__ingredients-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .recipe-ingredient-category-detail__ingredients {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }

    .recipe-ingredient-category-detail__empty {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        text-align: center;

        p {
            font-weight: bold;
        }
    }

    .recipe-ingredient-category-detail__note {
        margin-top: 20px;
        color: #888;
        font-style: italic;
    }
</style>
