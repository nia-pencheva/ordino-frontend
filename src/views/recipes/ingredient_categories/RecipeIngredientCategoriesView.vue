<template>
    <RecipeIngredientCategoriesLayout>
        <div class="recipe-ingredient-categories-view">
            <RecipeIngredientCategoriesSidebar :categories="categories" />
            <div class="recipe-ingredient-categories-layout__main">
                <div 
                    v-if="categories == undefined" 
                    class="recipe-ingredient-categories-layout__main__loader"
                >
                    <TheSpinner size="lg" />
                </div>
                <RouterView
                    v-else
                    v-slot="{ Component }"
                >
                    <component 
                        :is="Component" 
                        v-if="Component" 
                    />
                    <RecipeIngredientCategoriesRootDetailView
                        v-else 
                    />
                </RouterView>
            </div>
        </div>
    </RecipeIngredientCategoriesLayout>

    <RemoveCategoryPopup
        v-if="removeCategoryTarget"
        :category="removeCategoryTarget"
        @close="removeCategoryTarget = undefined"
        @removed-category="handleRemovedCategory"
    />

    <RemoveIngredientPopup
        v-if="removeIngredientTarget && removeIngredientParent"
        :parent-category="removeIngredientParent"
        :ingredient="removeIngredientTarget"
        @close="removeIngredientTarget = undefined; removeIngredientParent = undefined"
        @removed-ingredient="handleRemovedIngredient"
    />
</template>

<script setup lang="ts">
    import { onMounted, provide, ref } from 'vue';
    import { type RecipeIngredientCategory, type RecipeIngredientCategoryProduct } from '@/components/recipes/ingredient_categories/recipe-ingredient-categories-models';
    import { fetchRecipeIngredientCategories, findParentById } from '@/components/recipes/ingredient_categories/recipe-ingredient-categories-utils';

    import RecipeIngredientCategoriesSidebar from '@/components/recipes/ingredient_categories/RecipeIngredientCategoriesSidebar.vue';
    import RecipeIngredientCategoriesLayout from '@/components/recipes/ingredient_categories/RecipeIngredientCategoriesLayout.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import RecipeIngredientCategoriesRootDetailView from './RecipeIngredientCategoriesRootDetailView.vue';
    import RemoveCategoryPopup from '@/components/recipes/ingredient_categories/RemoveCategoryPopup.vue';
    import RemoveIngredientPopup from '@/components/recipes/ingredient_categories/RemoveIngredientPopup.vue';
    import router from '@/router/index';

    const categories = ref<RecipeIngredientCategory[] | undefined>(undefined);
    
    const currentPage = ref<number>(1);

    const removeCategoryTarget = ref<RecipeIngredientCategory | undefined>(undefined);

    const removeIngredientTarget = ref<RecipeIngredientCategoryProduct | undefined>(undefined);
    const removeIngredientParent = ref<RecipeIngredientCategory | undefined>(undefined);

    function nextPage() {
        currentPage.value++;
    }

    function previousPage() {
        currentPage.value--;
    }

    function setPage(page: number) {
        currentPage.value = page;
    }
    function openRemoveCategoryPopup(_event: MouseEvent, category: RecipeIngredientCategory) {
        removeCategoryTarget.value = category;
    }

    function openRemoveIngredientPopup(product: RecipeIngredientCategoryProduct, parentCategory: RecipeIngredientCategory) {
        removeIngredientTarget.value = product;
        removeIngredientParent.value = parentCategory;
    }

    async function handleRemovedCategory() {
        const parent = findParentById(categories.value!, removeCategoryTarget.value!.id);

        if(parent !== null) {
            router.push({ name: "recipe-ingredient-categories", params: { id: parent.id } });
        }
        else {
            router.push({ name: "recipe-ingredient-categories" });
        }

        removeCategoryTarget.value = undefined;
        categories.value = await fetchRecipeIngredientCategories();
    }

    async function handleRemovedIngredient() {
        removeIngredientTarget.value = undefined;
        removeIngredientParent.value = undefined;
        setPage(1);
        categories.value = await fetchRecipeIngredientCategories();
    }

    onMounted(async () => {
        categories.value = await fetchRecipeIngredientCategories();
    });

    provide('categories', categories);
    provide('currentPage', currentPage);
    provide('nextPage', nextPage);
    provide('previousPage', previousPage);
    provide('setPage', setPage);
    provide('openRemoveCategoryPopup', openRemoveCategoryPopup);
    provide('openRemoveIngredientPopup', openRemoveIngredientPopup);
</script>

<style lang="scss">
    .recipe-ingredient-categories-view {
        display: flex;
        flex-direction: column;
        width: 100%;

        @include desktop() {
            flex-direction: row;
            align-items: flex-start;
        }
    }

    .recipe-ingredient-categories-layout__main {
        flex: 1;
        min-width: 0;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-color: white;

        @include desktop() {
            position: static;
        }
    }

    .recipe-ingredient-categories-layout__main__loader {
        display: flex;
        align-items: center;
        justify-content: center;
    } 
</style>
