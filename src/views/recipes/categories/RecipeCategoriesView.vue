<template>
    <TheLayout>
        <TheTitle>Recipe Categories</TheTitle>

        <div class="recipe-categories-view__toolbar">
            <TheButton
                @click="router.push({ name: 'add-recipe-category' })"
                class="recipe-categories-view__add-button"
            >
                Add
            </TheButton>
        </div>

        <div class="recipe-categories-view__wrapper">
            <div
                v-if="!loaded"
                class="recipe-categories-view__loader"
            >
                <TheSpinner size="lg" />
            </div>
            <template v-else>
                <div
                    v-if="categoriesPage?.totalElements != 0"
                    class="recipe-categories-view__results"
                >
                    <RecipeCategoriesTable
                        :recipeCategories="categoriesPage?.recipeCategories"
                        @delete="openDeletePopup"
                    />

                    <ThePager
                        v-if="(categoriesPage?.totalElements ?? 0) > pageSize"
                        :current-page="currentPage"
                        :total-pages="categoriesPage?.totalPages"
                        @previous="getPreviousPage()"
                        @next="getNextPage()"
                    />
                </div>

                <div
                    v-else
                    class="recipe-categories-view__no-results"
                >
                    <p>No recipe categories found</p>
                </div>
            </template>
        </div>

        <DeleteRecipeCategoryPopup
            v-if="categoryToDelete"
            :recipeCategory="categoryToDelete"
            @close="categoryToDelete = undefined"
            @deleted="onDeleted"
        />
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { RecipeCategory, RecipeCategoriesPage } from '@/components/recipes/categories/recipe-categories-models';
    import { APICall } from '@/service/api/api';

    import TheButton from '@/components/base/TheButton.vue';
    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import ThePager from '@/components/base/ThePager.vue';
    import RecipeCategoriesTable from '@/components/recipes/categories/RecipeCategoriesTable.vue';
    import DeleteRecipeCategoryPopup from '@/components/recipes/categories/DeleteRecipeCategoryPopup.vue';

    const router = useRouter();

    const pageSize = 10;

    const categoriesPage = ref<RecipeCategoriesPage | undefined>(undefined);
    const currentPage = ref<number>(1);
    const categoryToDelete = ref<RecipeCategory | undefined>(undefined);

    const loaded = computed<boolean>(() => categoriesPage.value != undefined);

    async function fetchCategories() {
        categoriesPage.value = await (new APICall<RecipeCategoriesPage>(`recipe-categories?page=${currentPage.value}&pageSize=${pageSize}`)).execute();

        if((categoriesPage.value?.totalElements ?? 0) > 0 && categoriesPage.value?.recipeCategories.length == 0) {
            getPreviousPage();
        }
    }

    async function getNextPage() {
        currentPage.value++;
        categoriesPage.value = undefined;
        await fetchCategories();
    }

    async function getPreviousPage() {
        currentPage.value--;
        categoriesPage.value = undefined;
        await fetchCategories();
    }

    function openDeletePopup(recipeCategory: RecipeCategory) {
        categoryToDelete.value = recipeCategory;
    }

    async function onDeleted() {
        categoryToDelete.value = undefined;
        categoriesPage.value = undefined;
        await fetchCategories();
    }

    onMounted(async () => {
        await fetchCategories();
    });
</script>

<style lang="scss">
    .recipe-categories-view__toolbar {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        margin-bottom: 20px;
    }

    .recipe-categories-view__add-button {
        width: 75px;
        padding: 4px;
    }

    .recipe-categories-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .recipe-categories-view__wrapper {
        flex: 1;
        display: flex;
    }

    .recipe-categories-view__results {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 20px;
    }

    .recipe-categories-view__no-results {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;

        p {
            font-weight: bold;
        }
    }
</style>
