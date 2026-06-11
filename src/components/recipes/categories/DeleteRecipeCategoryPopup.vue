<template>
    <div class="delete-recipe-category-popup__overlay">
        <TheWindow>
            <div class="delete-recipe-category-popup__content">
                <p>Delete category <b>{{ props.recipeCategory?.category }}</b>?</p>

                <p 
                    v-if="props.recipeCategory?.recipesCount"
                    class="delete-recipe-category-popup__warning"    
                >
                    This category is used in <b>{{ props.recipeCategory?.recipesCount }}</b> recep{{ props.recipeCategory?.recipesCount === 1 ? 'ie' : 'ies' }}
                </p>

                <div class="delete-recipe-category-popup__buttons">
                    <TheButton @click="handleConfirm">Confirm</TheButton>
                    <TheButton type="important" @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
    import { APICall } from '@/service/api/api';
    import { RecipeCategory } from './recipe-categories-models';

    import TheWindow from '@/components/base/TheWindow.vue';
    import TheButton from '@/components/base/TheButton.vue';

    interface Props {
        recipeCategory?: RecipeCategory
    }

    const props = defineProps<Props>();
    const emit = defineEmits(['close', 'deleted']);

    async function handleConfirm() {
        await (new APICall(`recipe-categories/${props.recipeCategory?.id}`, 'DELETE')).execute();
        emit('deleted');
    }
</script>

<style lang="scss">
    .delete-recipe-category-popup__overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .delete-recipe-category-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;
    }

    .delete-recipe-category-popup__warning {
        color: $fontColorError;
        font-size: 13px;
        margin-top: -10px;
    }

    .delete-recipe-category-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .delete-recipe-category-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>
