<template>
    <div class="remove-ingredient-popup__overlay">
        <TheWindow>
            <div class="remove-ingredient-popup__content">
                <p>Remove ingredient <b>{{ ingredient.name }}</b> <br>from category <b>{{ parentCategory.category }}</b>?</p>

                <div class="remove-ingredient-popup__buttons">
                    <TheButton @click="handleConfirm">Confirm</TheButton>
                    <TheButton type="important" @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
    import { APICall } from '@/service/api/api';
    import { RecipeIngredientCategory, RecipeIngredientCategoryProduct } from './recipe-ingredient-categories-models';

    import TheWindow from '@/components/base/TheWindow.vue';
    import TheButton from '@/components/base/TheButton.vue';

    interface Props {
        parentCategory: RecipeIngredientCategory
        ingredient: RecipeIngredientCategoryProduct
    }

    const props = defineProps<Props>();

    const emit = defineEmits(['close', 'removed-ingredient']);

    async function handleConfirm() {
        await (new APICall(`recipe-ingredient-categories/${props.parentCategory.id}/remove-product/${props.ingredient.id}`, 'DELETE')).execute();
        emit('removed-ingredient');
    }
</script>

<style lang="scss">
    .remove-ingredient-popup__overlay {
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

    .remove-ingredient-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;

        p {
            text-align: center;
        }
    }

    .remove-ingredient-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .remove-ingredient-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>