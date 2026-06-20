<template>
    <div class="delete-loss-reason-popup__overlay">
        <TheWindow>
            <div class="delete-loss-reason-popup__content">
                <p>Delete loss reason <b>{{ props.lossReason?.reason }}</b>?</p>

                <div class="delete-loss-reason-popup__buttons">
                    <TheButton @click="handleConfirm">Confirm</TheButton>
                    <TheButton type="important" @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
    import { APICall } from '@/service/api/api';
    import { LossReason } from './loss-reasons-models';

    import TheWindow from '@/components/base/TheWindow.vue';
    import TheButton from '@/components/base/TheButton.vue';

    interface Props {
        lossReason?: LossReason
    }

    const props = defineProps<Props>();
    const emit = defineEmits(['close', 'deleted']);

    async function handleConfirm() {
        await (new APICall(`loss-reasons/${props.lossReason?.id}`, 'DELETE')).execute();
        emit('deleted');
    }
</script>

<style lang="scss">
    .delete-loss-reason-popup__overlay {
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

    .delete-loss-reason-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;
    }

    .delete-loss-reason-popup__warning {
        color: $fontColorError;
        font-size: 13px;
        margin-top: -10px;
    }

    .delete-loss-reason-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .delete-loss-reason-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>
