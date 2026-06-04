<template>
    <div class="delete-unit-popup__overlay">
        <TheWindow>
            <div class="delete-unit-popup__content">
                <p>Delete unit <b>{{ props.unit.unit }}</b>?</p>

                <div class="delete-unit-popup__buttons">
                    <TheButton @click="handleConfirm">Confirm</TheButton>
                    <TheButton type="important" @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
    import { APICall } from '@/service/api/api';
    import { Unit } from './units-models';

    import TheWindow from '../base/TheWindow.vue';
    import TheButton from '../base/TheButton.vue';

    interface Props {
        unit: Unit
    }

    const props = defineProps<Props>();

    const emit = defineEmits(['close', 'deleted-unit']);

    async function handleConfirm() {
        await (new APICall(`units/${props.unit.id}`, 'DELETE')).execute();
        emit('deleted-unit');
    }
</script>

<style lang="scss">
    .delete-unit-popup__overlay {
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

    .delete-unit-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;
    }

    .delete-unit-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .delete-unit-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>
