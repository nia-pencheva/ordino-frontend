<template>
    <TheLayout :content-styles="['add-recipe-category-view']">
        <TheTitle>Add Recipe Category</TheTitle>

        <RecipeCategoryForm />
    </TheLayout>
</template>

<script setup lang="ts">
    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import RecipeCategoryForm from '@/components/recipes/categories/RecipeCategoryForm.vue';
</script>

<style lang="scss">
    .add-recipe-category-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
