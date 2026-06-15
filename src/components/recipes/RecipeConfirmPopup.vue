<template>
    <div class="recipe-confirm-popup__overlay">
        <TheWindow>
            <div class="recipe-confirm-popup__content">
                <p>{{ props.message }}</p>

                <div class="recipe-confirm-popup__buttons">
                    <TheButton @click="emit('confirm')">Confirm</TheButton>
                    <TheButton type="important" @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
import TheWindow from '@/components/base/TheWindow.vue'
import TheButton from '@/components/base/TheButton.vue'

interface Props {
    message: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
    confirm: []
    close: []
}>()
</script>

<style lang="scss">
    .recipe-confirm-popup__overlay {
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

    .recipe-confirm-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-width: 200px;
    }

    .recipe-confirm-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .recipe-confirm-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>
