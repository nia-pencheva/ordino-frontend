<template>
    <div class="recipe-return-popup__overlay">
        <TheWindow>
            <div class="recipe-return-popup__content">
                <p>Return recipe for revision?</p>

                <TextArea 
                    v-model="returnNotes" 
                    class="recipe-return-popup__notes" 
                    placeholder="Return notes..."    
                />

                <div class="recipe-return-popup__buttons">
                    <TheButton @click="handleConfirm">Confirm</TheButton>
                    <TheButton type="important" @click="emit('close')">Cancel</TheButton>
                </div>
            </div>
        </TheWindow>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { APICall } from '@/service/api/api'

import TheWindow from '@/components/base/TheWindow.vue'
import TheButton from '@/components/base/TheButton.vue'
import TextArea from '@/components/base/TextArea.vue'

interface Props {
    recipeId: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
    done: []
    close: []
}>()

const returnNotes = ref<string>('')

async function handleConfirm() {
    await new APICall(`recipes/${props.recipeId}/return-for-revision`, 'POST', {
        returnNotes: returnNotes.value || null
    }).execute()
    emit('done')
}
</script>

<style lang="scss">
    .recipe-return-popup__overlay {
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

    .recipe-return-popup__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        min-width: 300px;
    }

    .recipe-return-popup__notes {
        width: 100%;
        height: 80px;
        resize: vertical;
    }

    .recipe-return-popup__buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .recipe-return-popup__buttons .the-button {
        padding: 4px 12px;
    }
</style>
