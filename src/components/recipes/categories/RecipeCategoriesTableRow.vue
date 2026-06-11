<template>
    <div class="recipe-categories-table__row">
        <p>{{ props.recipeCategory.category }}</p>

        <div class="recipe-categories-table__row__actions">
            <TheButton
                @click.stop="router.push({ name: 'edit-recipe-category', params: { id: props.recipeCategory.id } })"
                class="recipe-categories-table__row__action-button"
            >
                Edit
            </TheButton>

            <TheButton
                @click.stop="emit('delete', props.recipeCategory)"
                class="recipe-categories-table__row__action-button"
                type="important"
            >
                Delete
            </TheButton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { RecipeCategory } from './recipe-categories-models';
    import { useRouter } from 'vue-router';

    import TheButton from '@/components/base/TheButton.vue';

    const router = useRouter();

    interface Props {
        recipeCategory: RecipeCategory
    }

    const props = defineProps<Props>();
    const emit = defineEmits<{
        delete: [recipeCategory: RecipeCategory]
    }>();
</script>

<style lang="scss">
    .recipe-categories-table__row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        height: $tableRowHeight;
        padding: 10px;
        background-color: white;
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

    .recipe-categories-table__row__actions {
        display: flex;
        flex-direction: row;
        gap: 6px;
        flex-shrink: 0;
    }

    .recipe-categories-table__row__action-button {
        width: 60px;
        padding: 4px;
    }
</style>
