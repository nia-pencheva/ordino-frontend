<template>
    <div class="delete-user-popup__overlay">
        <TheWindow>
            <div class="delete-user-popup__content">
                <p>Delete user <b>{{ username }}</b>?</p>

                <div class="delete-user-popup__buttons">
                    <TheButton @click="handleConfirm">Confirm</TheButton>
                    <TheButton type="important" @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
    import { APICall } from '@/service/api/api';

    import TheWindow from '../base/TheWindow.vue';
    import TheButton from '../base/TheButton.vue';

    interface Props {
        userId: Number
        username: string
    }

    const props = defineProps<Props>();
    const emit = defineEmits(['close', 'deleted']);

    async function handleConfirm() {
        await (new APICall(`users/${props.userId}`, 'DELETE')).execute();
        emit('deleted');
    }
</script>

<style lang="scss">
    .delete-user-popup__overlay {
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

    .delete-user-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;
    }

    .delete-user-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .delete-user-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>
