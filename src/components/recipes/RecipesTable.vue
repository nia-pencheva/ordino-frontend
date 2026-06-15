<template>
    <div class="recipes-table">
        <RecipesTableRow
            v-for="recipe in recipes"
            :key="recipe.id"
            :recipe="recipe"
        />
    </div>
</template>

<script setup lang="ts">
    import { Recipe } from './recipes-models';

    import RecipesTableRow from './RecipesTableRow.vue';

    interface Props {
        recipes: Recipe[] | undefined
    }

    const props = defineProps<Props>();
</script>

<style lang="scss">
    .recipes-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }
</style>
