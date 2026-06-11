<template>
    <TheLayout :content-styles="['edit-recipe-category-view']">
        <TheTitle>Edit Recipe Category</TheTitle>

        <br>

        <div class="edit-recipe-category-view__loader" v-if="!loaded">
            <TheSpinner size="lg" />
        </div>
        
        <RecipeCategoryForm
            v-else
            :recipeCategory="recipeCategory"
        />
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { RecipeCategory } from '@/components/recipes/categories/recipe-categories-models';
    import { APICall } from '@/service/api/api';

    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import RecipeCategoryForm from '@/components/recipes/categories/RecipeCategoryForm.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';

    const route = useRoute();

    const recipeCategory = ref<RecipeCategory | undefined>(undefined);

    const loaded = computed<boolean>(() => recipeCategory.value !== undefined);

    async function fetchRecipeCategory() {
        recipeCategory.value = await (new APICall<RecipeCategory>('recipe-categories/' + route.params.id)).execute();
    }

    onMounted(async () => {
        await fetchRecipeCategory();
    });
</script>

<style lang="scss">
    .edit-recipe-category-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .edit-recipe-category-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
