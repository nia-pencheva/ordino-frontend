<template>
    <div class="recipes-table__row__wrapper">
        <div class="recipes-table__row" @click="router.push('/recipes/' + props.recipe.id)">
            <p>{{ props.recipe.title }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Recipe } from './recipes-models';
    import router from '@/router/index';

    interface Props {
        recipe: Recipe
    }

    const props = defineProps<Props>();
</script>

<style lang="scss">
    .recipes-table__row__wrapper {
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

    .recipes-table__row {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 10px;
        background-color: white;
        border-radius: 5px;
        height: $tableRowHeight;
    }
</style>
