<template>
    <div class="delete-unit-category-popup__overlay">
        <TheWindow>
            <div class="delete-unit-category-popup__content">
                <p>Delete unit category <b>{{ props.unitCategory.category }}</b>?</p>

                <div class="delete-unit-category-popup__buttons">
                    <TheButton @click="handleConfirm">Confirm</TheButton>
                    <TheButton type="important" @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
    import { APICall } from '@/service/api/api';
    import { UnitCategoryForUnitsPage } from './units-models';

    import TheWindow from '../base/TheWindow.vue';
    import TheButton from '../base/TheButton.vue';

    interface Props {
        unitCategory: UnitCategoryForUnitsPage
    }

    const props = defineProps<Props>();

    const emit = defineEmits(['close', 'deleted-unit-category']);

    async function handleConfirm() {
        await (new APICall(`unit-categories/${props.unitCategory.id}`, 'DELETE')).execute();
        emit('deleted-unit-category');
    }
</script>

<style lang="scss">
    .delete-unit-category-popup__overlay {
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

    .delete-unit-category-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;
    }

    .delete-unit-category-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .delete-unit-category-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>
