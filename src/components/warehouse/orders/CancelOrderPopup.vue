<template>
    <div class="cancel-order-popup__overlay">
        <TheWindow>
            <div class="cancel-order-popup__content">
                <p>Cancel order <b>#{{ props.orderId }}</b>?</p>

                <div class="cancel-order-popup__buttons">
                    <TheButton type="important" @click="handleConfirm">Confirm</TheButton>
                    <TheButton @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
import { APICall } from '@/service/api/api'

import TheWindow from '@/components/base/TheWindow.vue'
import TheButton from '@/components/base/TheButton.vue'

interface Props {
    orderId: number
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'cancelled'])

async function handleConfirm() {
    await new APICall(`orders/${props.orderId}/cancel`, 'POST').execute()
    emit('cancelled')
}
</script>

<style lang="scss">
    .cancel-order-popup__overlay {
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

    .cancel-order-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;
        text-align: center;
    }

    .cancel-order-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .cancel-order-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>
